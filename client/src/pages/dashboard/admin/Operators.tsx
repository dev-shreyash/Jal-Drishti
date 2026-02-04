import { useEffect, useState } from "react";
import {
  getOperators,
  createOperator,
  updateOperator,
  deleteOperator,
} from "../../../services/operator";
import { getVillages } from "../../../services/village";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Droplet,
  Building2,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  User,
  Phone,
  Key,
  Shield,
  Activity,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";

interface Village {
  village_id: number;
  village_name: string;
}

interface Operator {
  operator_id: number;
  name: string;
  username: string;
  phone: string;
  village_id: number;
  is_active: boolean;
  password_hash?: string;
  village?: Village;
}

interface OperatorForm {
  name: string;
  username: string;
  phone: string;
  password_hash: string;
  village_id: string;
  is_active: boolean;
}

export default function Operators() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Operator | null>(null);
  const [form, setForm] = useState<OperatorForm>({
    name: "",
    username: "",
    phone: "",
    password_hash: "",
    village_id: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [operatorsData, villagesData] = await Promise.all([
        getOperators(),
        getVillages()
      ]);
      setOperators(operatorsData);
      setVillages(villagesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      const submissionData = {
        ...form,
        village_id: form.village_id ? parseInt(form.village_id) : 0,
        // Don't send password hash if editing and password field is empty
        ...(edit && !form.password_hash && { password_hash: undefined })
      };

      if (edit) {
        await updateOperator(edit.operator_id, submissionData);
      } else {
        await createOperator(submissionData);
      }

      setOpen(false);
      setEdit(null);
      setForm({
        name: "",
        username: "",
        phone: "",
        password_hash: "",
        village_id: "",
        is_active: true,
      });
      setShowPassword(false);
      load();
    } catch (error) {
      console.error("Failed to save operator:", error);
    }
  };

  const handleDelete = async (operatorId: number) => {
    try {
      await deleteOperator(operatorId);
      setConfirmDelete(null);
      load();
    } catch (error) {
      console.error("Failed to delete operator:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-700 p-2 rounded-lg">
                <Droplet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jal-Drishti</h1>
                <p className="text-sm text-gray-600">Water Resource Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                
              </div>
            
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 mr-6">
            <nav className="bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-1">
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                       <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => navigate("/admin/villages")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Villages</span>
                </button>
                <button
                  onClick={() => navigate("/admin/pumps")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Droplet className="h-5 w-5" />
                  <span>Pumps</span>
                </button>
                <button
                  onClick={() => navigate("/admin/tanks")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Tanks</span>
                </button>
                <button
                  onClick={() => navigate("/admin/operators")}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Operators</span>
                </button>
              </div>
            </nav>

            {/* Stats Card */}
            <div className="mt-6 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Operators</p>
                  <p className="text-2xl font-bold">{operators.length}</p>
                </div>
                <Users className="h-12 w-12 opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-amber-500">
                <p className="text-sm opacity-90">Active Operators</p>
                <p className="text-xl font-semibold">
                  {operators.filter(o => o.is_active).length}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-medium text-gray-900 mb-3">Operator Duties</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Daily pump inspection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Droplet className="h-4 w-4 text-blue-600" />
                  <span>Water quality testing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span>Issue reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Equipment maintenance</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Operators Management</h1>
                  <p className="text-gray-600">Manage field operators responsible for water system maintenance</p>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Operator</span>
                </button>
              </div>
            </div>

            {/* Operators Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">All Operators</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  <p className="mt-2 text-gray-600">Loading operators data...</p>
                </div>
              ) : operators.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-600">No operators found. Add your first operator.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Operator Details</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contact</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Assigned Village</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {operators.map((o) => (
                        <tr key={o.operator_id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{o.name}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <User className="h-4 w-4" />
                                <span>@{o.username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{o.phone || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{o.village?.village_name || "Unassigned"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${o.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {o.is_active ? (
                                <>
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <UserX className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEdit(o);
                                  setForm({
                                    name: o.name || "",
                                    username: o.username || "",
                                    phone: o.phone || "",
                                    password_hash: "",
                                    village_id: o.village_id?.toString() || "",
                                    is_active: o.is_active || true,
                                  });
                                  setOpen(true);
                                }}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => setConfirmDelete(o.operator_id)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm">Delete</span>
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

            {/* Info Footer */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Security Note:</strong> Operator accounts should be created only for authorized field staff. 
                    Ensure passwords are strong and regularly updated. Deactivate accounts immediately when operators are reassigned.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Operator Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {edit ? "Edit Operator Details" : "Register New Operator"}
                    </h2>
                    <p className="text-sm text-gray-600">Fill in the operator information below</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setEdit(null);
                    setForm({
                      name: "",
                      username: "",
                      phone: "",
                      password_hash: "",
                      village_id: "",
                      is_active: true,
                    });
                    setShowPassword(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter operator's full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {edit ? "New Password (leave blank to keep current)" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={edit ? "Enter new password or leave blank" : "Enter password"}
                      value={form.password_hash}
                      onChange={(e) =>
                        setForm({ ...form, password_hash: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <Key className="h-5 w-5" />
                      ) : (
                        <Key className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {edit ? "Password will only be updated if field is not empty" : "Create a strong password for the operator"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Village
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={form.village_id}
                    onChange={(e) =>
                      setForm({ ...form, village_id: e.target.value })
                    }
                  >
                    <option value="">Select Village</option>
                    {villages.map((v) => (
                      <option key={v.village_id} value={v.village_id}>
                        {v.village_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="active-status"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="active-status" className="flex items-center space-x-2">
                    {form.is_active ? (
                      <UserCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <UserX className="h-5 w-5 text-gray-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {form.is_active ? "Active" : "Inactive"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {form.is_active 
                          ? "Operator can access the system" 
                          : "Operator account is disabled"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    setEdit(null);
                    setForm({
                      name: "",
                      username: "",
                      phone: "",
                      password_hash: "",
                      village_id: "",
                      is_active: true,
                    });
                    setShowPassword(false);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center space-x-2"
                >
                  <Check className="h-5 w-5" />
                  <span>{edit ? "Update Operator" : "Register Operator"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
                  <p className="text-gray-600">Are you sure you want to delete this operator?</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. The operator will lose all system access 
                  and their assigned duties will need to be reassigned.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Operator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}