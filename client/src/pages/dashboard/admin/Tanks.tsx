import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTanks,
  createTank,
  updateTank,
  deleteTank,
} from "../../../services/tank";
import { getVillages } from "../../../services/village";
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
  Thermometer,
  Database,
  Smartphone,

} from "lucide-react";

interface Village {
  village_id: number;
  village_name: string;
}

interface Tank {
  tank_id: number;
  tank_name: string;
  capacity_liters: number;
  material_type: string;
  latitude: number;
  longitude: number;
  last_cleaned_date: string;
  village_id: number;
  is_smart_tank: boolean;
  village?: Village;
}

interface TankForm {
  tank_name: string;
  capacity_liters: string;
  material_type: string;
  latitude: string;
  longitude: string;
  last_cleaned_date: string;
  village_id: string;
  is_smart_tank: boolean;
}

export default function Tanks() {
  const navigate = useNavigate();

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [open, setOpen] = useState(false);
  const [editTank, setEditTank] = useState<Tank | null>(null);
  const [form, setForm] = useState<TankForm>({
    tank_name: "",
    capacity_liters: "",
    material_type: "",
    latitude: "",
    longitude: "",
    last_cleaned_date: "",
    village_id: "",
    is_smart_tank: false,
  });
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [tanksData, villagesData] = await Promise.all([
        getTanks(),
        getVillages()
      ]);
      setTanks(tanksData);
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
        tank_name: form.tank_name,
        capacity_liters: form.capacity_liters ? parseFloat(form.capacity_liters) : 0,
        material_type: form.material_type,
        latitude: form.latitude ? parseFloat(form.latitude) : 0,
        longitude: form.longitude ? parseFloat(form.longitude) : 0,
        last_cleaned_date: form.last_cleaned_date,
        village_id: form.village_id ? parseInt(form.village_id) : 0,
        is_smart_tank: form.is_smart_tank,
      };

      if (editTank) {
        await updateTank(editTank.tank_id, submissionData);
      } else {
        await createTank(submissionData);
      }

      setOpen(false);
      setEditTank(null);
      setForm({
        tank_name: "",
        capacity_liters: "",
        material_type: "",
        latitude: "",
        longitude: "",
        last_cleaned_date: "",
        village_id: "",
        is_smart_tank: false,
      });
      load();
    } catch (error) {
      console.error("Failed to save tank:", error);
    }
  };

  const handleDelete = async (tankId: number) => {
    try {
      await deleteTank(tankId);
      setConfirmDelete(null);
      load();
    } catch (error) {
      console.error("Failed to delete tank:", error);
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
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg"
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
            <div className="mt-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-lg shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Tanks</p>
                  <p className="text-2xl font-bold">{tanks.length}</p>
                </div>
                <Building2 className="h-12 w-12 opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-500">
                <p className="text-sm opacity-90">Total Capacity</p>
                <p className="text-xl font-semibold">
                  {tanks.reduce((sum, t) => sum + (t.capacity_liters || 0), 0).toLocaleString()} L
                </p>
              </div>
            </div>

            {/* Material Distribution */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h4 className="font-medium text-gray-900 mb-3">Material Distribution</h4>
              <div className="space-y-2">
                {Array.from(new Set(tanks.map(t => t.material_type).filter(Boolean))).map(material => (
                  <div key={material} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{material || "Unknown"}</span>
                    <span className="font-medium">
                      {tanks.filter(t => t.material_type === material).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Water Tanks Management</h1>
                  <p className="text-gray-600">Manage and monitor all water storage tanks across villages</p>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Tank</span>
                </button>
              </div>
            </div>

            {/* Tanks Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">All Water Tanks</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  <p className="mt-2 text-gray-600">Loading tanks data...</p>
                </div>
              ) : tanks.length === 0 ? (
                <div className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-600">No tanks found. Add your first tank.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tank Details</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Village</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Capacity</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Material</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {tanks.map((t) => (
                        <tr key={t.tank_id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{t.tank_name}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <Thermometer className="h-4 w-4" />
                                <span>Last cleaned: {t.last_cleaned_date ? new Date(t.last_cleaned_date).toLocaleDateString('en-IN') : "Never"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{t.village?.village_name || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Database className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold">{t.capacity_liters?.toLocaleString() || "0"}</span>
                              <span className="text-gray-500">L</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {t.material_type || "Not specified"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${t.is_smart_tank ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {t.is_smart_tank ? (
                                <>
                                  <Smartphone className="h-3 w-3 mr-1" />
                                  Smart Tank
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
                                  setEditTank(t);
                                  setForm({
                                    tank_name: t.tank_name || "",
                                    capacity_liters: t.capacity_liters?.toString() || "",
                                    material_type: t.material_type || "",
                                    latitude: t.latitude?.toString() || "",
                                    longitude: t.longitude?.toString() || "",
                                    last_cleaned_date: t.last_cleaned_date ? t.last_cleaned_date.split('T')[0] : "",
                                    village_id: t.village_id?.toString() || "",
                                    is_smart_tank: t.is_smart_tank || false,
                                  });
                                  setOpen(true);
                                }}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => setConfirmDelete(t.tank_id)}
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
                <Building2 className="h-5 w-5 text-blue-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Regular maintenance and cleaning of water tanks is essential for water quality. 
                    Smart tanks provide real-time water level monitoring and quality alerts.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Tank Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editTank ? "Edit Tank Details" : "Register New Tank"}
                    </h2>
                    <p className="text-sm text-gray-600">Fill in the tank information below</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setEditTank(null);
                    setForm({
                      tank_name: "",
                      capacity_liters: "",
                      material_type: "",
                      latitude: "",
                      longitude: "",
                      last_cleaned_date: "",
                      village_id: "",
                      is_smart_tank: false,
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
                    Tank Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tank name"
                    value={form.tank_name}
                    onChange={(e) =>
                      setForm({ ...form, tank_name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (Liters)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter capacity in liters"
                    value={form.capacity_liters}
                    onChange={(e) =>
                      setForm({ ...form, capacity_liters: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Type
                  </label>
                  <select
                    value={form.material_type}
                    onChange={(e) =>
                      setForm({ ...form, material_type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="">Select Material</option>
                    <option value="Concrete">Concrete</option>
                    <option value="Steel">Steel</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Fiberglass">Fiberglass</option>
                    <option value="RCC">RCC (Reinforced Cement Concrete)</option>
                    <option value="Brick">Brick Masonry</option>
                  </select>
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
                    Last Cleaned Date
                  </label>
                  <input
                    type="date"
                    value={form.last_cleaned_date}
                    onChange={(e) =>
                      setForm({ ...form, last_cleaned_date: e.target.value })
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
                    id="smart-tank"
                    checked={form.is_smart_tank}
                    onChange={(e) =>
                      setForm({ ...form, is_smart_tank: e.target.checked })
                    }
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="smart-tank" className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Smart Tank</p>
                      <p className="text-sm text-gray-500">Enable IoT monitoring and water level alerts</p>
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
                    setEditTank(null);
                    setForm({
                      tank_name: "",
                      capacity_liters: "",
                      material_type: "",
                      latitude: "",
                      longitude: "",
                      last_cleaned_date: "",
                      village_id: "",
                      is_smart_tank: false,
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
                  <span>{editTank ? "Update Tank" : "Register Tank"}</span>
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
                  <p className="text-gray-600">Are you sure you want to delete this tank?</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All tank data and associated monitoring records will be permanently deleted.
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
                  <span>Delete Tank</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}