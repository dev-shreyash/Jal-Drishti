import { useEffect, useState } from "react";
import { getOperators, createOperator, updateOperator, deleteOperator } from "../../../services/operator";
import { 
  Plus, Edit2, Trash2, Users, MapPin, 
  Phone, Key, Check, X, Copy, ShieldCheck, UserPlus
} from "lucide-react";

// --- Types ---
interface Operator {
  operator_id: number;
  name: string;
  contact_number: string;
  username: string;
  village_id: number;
  village?: { village_name: string };
  role?: string;
  status?: string;
}

interface OperatorForm {
  name: string;
  contact_number: string;
  username: string;
  password?: string;
}

export default function Operators() {
  // State
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Credential Reveal State
  const [successCreds, setSuccessCreds] = useState<{user: string, pass: string} | null>(null);

  const [form, setForm] = useState<OperatorForm>({
    name: "",
    contact_number: "",
    username: "",
    password: "" 
  });

  // 1. Load Data (Only Operators now)
  const load = async (refresh = false) => {
    if (refresh) setLoading(true);
    try {
      const opsData = await getOperators();
      setOperators(opsData);
    } catch (error) {
      console.error("Failed to load operators:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    load(false);
  }, []);

  // 2. Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        contact_number: form.contact_number,
        username: form.username,
        // Backend will assign village_id from the Admin's token automatically
        ...(form.password ? { password: form.password } : {})
      };

      if (editMode && selectedId) {
        await updateOperator(selectedId, payload);
        handleClose();
        load(true);
      } else {
        await createOperator(payload);
        setSuccessCreds({ user: form.username, pass: form.password || "" });
        load(true); 
      }
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Failed to save operator. Username might be taken.");
    }
  };

  // 3. Delete Logic
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This will immediately revoke their access.")) return;
    try {
      await deleteOperator(id);
      load(true);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Helper Functions
  const handleEdit = (op: Operator) => {
    setEditMode(true);
    setSelectedId(op.operator_id);
    setForm({
      name: op.name,
      contact_number: op.contact_number,
      username: op.username,
      password: "" 
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSuccessCreds(null);
    setForm({ name: "", contact_number: "", username: "", password: "" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600"/>
            Field Operators
          </h1>
          <p className="text-gray-600 text-sm">Manage staff accounts and access</p>
        </div>
        <button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <UserPlus className="h-5 w-5" />
          <span>Register New Operator</span>
        </button>
      </div>

      {/* Operators Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading staff directory...</div>
        ) : operators.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No operators found. Register your first field staff.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-6 font-semibold text-gray-700">Operator Details</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Village</th>
                  <th className="py-3 px-6 font-semibold text-gray-700">Account Status</th>
                  <th className="py-3 px-6 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {operators.map((op) => (
                  <tr key={op.operator_id} className="hover:bg-gray-50 group transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-base">{op.name}</div>
                      <div className="text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" /> {op.contact_number}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {/* Display village from fetched data (read-only) */}
                        <span className="font-medium">{op.village?.village_name || "Assigned"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3"/> Active
                        </span>
                        <span className="text-gray-400 text-xs font-mono bg-gray-100 px-1 rounded">@{op.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(op)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit Details">
                          <Edit2 className="h-4 w-4"/>
                        </button>
                        <button onClick={() => handleDelete(op.operator_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Revoke Access">
                          <Trash2 className="h-4 w-4"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600"/>
                {successCreds ? "Registration Successful!" : editMode ? "Edit Operator Details" : "Register Operator"}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5"/>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              
              {/* SUCCESS STATE */}
              {successCreds ? (
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Account Created</h3>
                  <p className="text-sm text-gray-500">
                    Share these credentials with the operator immediately. 
                    <br/><span className="text-red-500 text-xs font-bold">The password cannot be viewed again.</span>
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left space-y-3 mt-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                      <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100 mt-1">
                        <span className="font-mono text-gray-900 font-bold">{successCreds.user}</span>
                        <button onClick={() => copyToClipboard(successCreds.user)} className="text-blue-600 hover:text-blue-800"><Copy className="h-4 w-4"/></button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                      <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-100 mt-1">
                        <span className="font-mono text-gray-900 font-bold">{successCreds.pass}</span>
                        <button onClick={() => copyToClipboard(successCreds.pass)} className="text-blue-600 hover:text-blue-800"><Copy className="h-4 w-4"/></button>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleClose} className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-black mt-4 transition-colors">
                    Close
                  </button>
                </div>
              ) : (
                /* FORM STATE */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        required 
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="e.g. Ramesh Patil"
                        value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input 
                        required 
                        type="tel"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="10-digit number"
                        value={form.contact_number} onChange={e => setForm({...form, contact_number: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-4 pt-4 bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                      <Key className="h-3 w-3"/> Login Access
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                          <input 
                            required 
                            className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-mono text-sm"
                            value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                            placeholder="operator_username"
                          />
                          <span className="absolute left-3 top-3 text-gray-400 font-bold">@</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {editMode ? "Reset Password (Leave blank to keep)" : "Create Password"}
                        </label>
                        <input 
                          type="text" 
                          required={!editMode}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                          value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                          placeholder={editMode ? "••••••••" : "Enter a strong password"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors">
                      <Check className="h-4 w-4"/> {editMode ? "Update Details" : "Create Account"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}