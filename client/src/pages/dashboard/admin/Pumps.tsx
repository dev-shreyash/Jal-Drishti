import { useEffect, useState } from "react";
import {
  getPumps,
  createPump,
  updatePump,
  deletePump,
} from "../../../services/pump";
import { getVillages } from "../../../services/village";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Home, 
  Droplet, 
  MapPin, 
  Gauge,
  Smartphone,
  Check,
  Building2,
  Users,
  X,
 
} from "lucide-react";

interface Village {
  village_id: number;
  village_name: string;
}

interface Pump {
  pump_id: number;
  pump_name: string;
  model_number: string;
  qr_code: string;
  latitude: number;
  longitude: number;
  flow_rate_lph: number;
  village_id: number;
  is_smart_pump: boolean;
  village?: Village;
  status: 'active' | 'inactive' | 'maintenance'; 
}

interface PumpForm {
  pump_name: string;
  model_number: string;
  qr_code: string;
  latitude: string;
  longitude: string;
  flow_rate_lph: string;
  village_id: string;
  is_smart_pump: boolean;
}

export default function Pumps() {
  const navigate = useNavigate();

  const [pumps, setPumps] = useState<Pump[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [open, setOpen] = useState(false);
  const [editPump, setEditPump] = useState<Pump | null>(null);
  const [form, setForm] = useState<PumpForm>({
    pump_name: "",
    model_number: "",
    qr_code: "",
    latitude: "",
    longitude: "",
    flow_rate_lph: "",
    village_id: "",
    is_smart_pump: false,
  });
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [pumpsData, villagesData] = await Promise.all([
        getPumps(),
        getVillages()
      ]);
      setPumps(pumpsData);
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
      // Convert string values to numbers where needed
      const submissionData = {
        pump_name: form.pump_name,
        model_number: form.model_number,
        qr_code: form.qr_code,
        latitude: form.latitude ? parseFloat(form.latitude) : 0,
        longitude: form.longitude ? parseFloat(form.longitude) : 0,
        flow_rate_lph: form.flow_rate_lph ? parseFloat(form.flow_rate_lph) : 0,
        village_id: form.village_id ? parseInt(form.village_id) : 0,
        is_smart_pump: form.is_smart_pump,
      };

      if (editPump) {
        await updatePump(editPump.pump_id, submissionData);
      } else {
        await createPump(submissionData);
      }

      setOpen(false);
      setEditPump(null);
      setForm({
        pump_name: "",
        model_number: "",
        qr_code: "",
        latitude: "",
        longitude: "",
        flow_rate_lph: "",
        village_id: "",
        is_smart_pump: false,
      });
      load();
    } catch (error) {
      console.error("Failed to save pump:", error);
    }
  };

  const handleDelete = async (pumpId: number) => {
    try {
      await deletePump(pumpId);
      setConfirmDelete(null);
      load();
    } catch (error) {
      console.error("Failed to delete pump:", error);
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
        className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg"
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

  {/* Stats Card - FIXED VERSION */}
  <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">Total Pumps</p>
        <p className="text-2xl font-bold">{pumps.length}</p>
      </div>
      <Droplet className="h-12 w-12 opacity-80" />
    </div>
    
    {/* OPTION 1: If your Pump interface has a 'status' property */}
    {pumps[0]?.status !== undefined && (
      <div className="mt-4 pt-4 border-t border-blue-500">
        <p className="text-sm opacity-90">Active Pumps</p>
        <p className="text-xl font-semibold">
          {pumps.filter(p => p.status === 'active').length}
        </p>
      </div>
    )}
    
    {/* OPTION 2: If you don't have a 'status' property, use a different stat */}
    {pumps[0]?.status === undefined && (
      <div className="mt-4 pt-4 border-t border-blue-500">
        <p className="text-sm opacity-90">Installed Pumps</p>
        <p className="text-xl font-semibold">
          {pumps.length}
        </p>
      </div>
    )}
  </div>
</aside>  

          {/* Main Content */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Water Pumps Management</h1>
                  <p className="text-gray-600">Manage and monitor all water pumps across villages</p>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Pump</span>
                </button>
              </div>
            </div>

            {/* Pumps Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">All Pumps</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  <p className="mt-2 text-gray-600">Loading pumps data...</p>
                </div>
              ) : pumps.length === 0 ? (
                <div className="p-8 text-center">
                  <Droplet className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-600">No pumps found. Add your first pump.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Pump Details</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Village</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Flow Rate</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pumps.map((p) => (
                        <tr key={p.pump_id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{p.pump_name}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <Gauge className="h-4 w-4" />
                                <span>Model: {p.model_number || "N/A"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{p.village?.village_name || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-blue-700">{p.flow_rate_lph || "0"}</span>
                              <span className="text-gray-500">LPH</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${p.is_smart_pump ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {p.is_smart_pump ? (
                                <>
                                  <Smartphone className="h-3 w-3 mr-1" />
                                  Smart Pump
                                </>
                              ) : (
                                "Conventional"
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditPump(p);
                                  setForm({
                                    pump_name: p.pump_name || "",
                                    model_number: p.model_number || "",
                                    qr_code: p.qr_code || "",
                                    latitude: p.latitude?.toString() || "",
                                    longitude: p.longitude?.toString() || "",
                                    flow_rate_lph: p.flow_rate_lph?.toString() || "",
                                    village_id: p.village_id?.toString() || "",
                                    is_smart_pump: p.is_smart_pump || false,
                                  });
                                  setOpen(true);
                                }}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => setConfirmDelete(p.pump_id)}
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
                <Droplet className="h-5 w-5 text-blue-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Smart pumps enable real-time monitoring and automated water management. 
                    Contact the water resources department for smart pump installation guidelines.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Pump Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Droplet className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editPump ? "Edit Pump Details" : "Register New Pump"}
                    </h2>
                    <p className="text-sm text-gray-600">Fill in the pump information below</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setEditPump(null);
                    setForm({
                      pump_name: "",
                      model_number: "",
                      qr_code: "",
                      latitude: "",
                      longitude: "",
                      flow_rate_lph: "",
                      village_id: "",
                      is_smart_pump: false,
                    });
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
                    Pump Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pump name"
                    value={form.pump_name}
                    onChange={(e) =>
                      setForm({ ...form, pump_name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter model number"
                    value={form.model_number}
                    onChange={(e) =>
                      setForm({ ...form, model_number: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter QR code identifier"
                    value={form.qr_code}
                    onChange={(e) =>
                      setForm({ ...form, qr_code: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 28.7041"
                      value={form.latitude}
                      onChange={(e) =>
                        setForm({ ...form, latitude: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 77.1025"
                      value={form.longitude}
                      onChange={(e) =>
                        setForm({ ...form, longitude: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flow Rate (LPH)
                  </label>
                  <input
                    type="number"
                    placeholder="Litres per hour"
                    value={form.flow_rate_lph}
                    onChange={(e) =>
                      setForm({ ...form, flow_rate_lph: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Village
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
                    id="smart-pump"
                    checked={form.is_smart_pump}
                    onChange={(e) =>
                      setForm({ ...form, is_smart_pump: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="smart-pump" className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Smart Pump</p>
                      <p className="text-sm text-gray-500">Enable IoT monitoring and automation</p>
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
                    setEditPump(null);
                    setForm({
                      pump_name: "",
                      model_number: "",
                      qr_code: "",
                      latitude: "",
                      longitude: "",
                      flow_rate_lph: "",
                      village_id: "",
                      is_smart_pump: false,
                    });
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
                  <span>{editPump ? "Update Pump" : "Register Pump"}</span>
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
                  <p className="text-gray-600">Are you sure you want to delete this pump?</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All pump data will be permanently deleted.
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
                  <span>Delete Pump</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}