import { useEffect, useState } from "react";
import {
  getVillages,
  addVillage,
  updateVillage,
  deleteVillage,
} from "../../../services/village";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Building2,
  Hash,
  Droplet
} from "lucide-react";

interface Village {
  village_id: number;
  village_name: string;
  district: string;
  taluka: string;
  state: string;
  pincode: string;
  population: number;
}

interface VillageForm {
  village_name: string;
  district: string;
  taluka: string;
  state: string;
  pincode: string;
  population: string;
}

export default function Villages() {
  const navigate = useNavigate();
  const [villages, setVillages] = useState<Village[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Village | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [form, setForm] = useState<VillageForm>({
    village_name: "",
    district: "",
    taluka: "",
    state: "",
    pincode: "",
    population: "",
  });

  const loadVillages = async () => {
    setLoading(true);
    try {
      const data = await getVillages();
      setVillages(data);
    } catch (error) {
      console.error("Failed to load villages:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVillages();
  }, []);

  /* ---------- SAVE ---------- */
  const saveVillage = async () => {
    try {
      // Convert population to number
      const submissionData = {
        ...form,
        population: form.population ? parseInt(form.population) : 0,
      };

      if (editing) {
        await updateVillage(editing.village_id, submissionData);
      } else {
        await addVillage(submissionData);
      }

      setShowModal(false);
      setEditing(null);
      setForm({
        village_name: "",
        district: "",
        taluka: "",
        state: "",
        pincode: "",
        population: "",
      });

      loadVillages();
    } catch (error) {
      console.error("Failed to save village:", error);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id: number) => {
    try {
      await deleteVillage(id);
      setConfirmDelete(null);
      loadVillages();
    } catch (error) {
      console.error("Failed to delete village:", error);
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
        className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg"
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
  <div className="mt-6 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg shadow-md p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">Total Villages</p>
        <p className="text-2xl font-bold">{villages.length}</p>
      </div>
      <MapPin className="h-12 w-12 opacity-80" />
    </div>
    <div className="mt-4 pt-4 border-t border-green-500">
      <p className="text-sm opacity-90">Total Population</p>
      <p className="text-xl font-semibold">
        {villages.reduce((sum, v) => sum + (v.population || 0), 0).toLocaleString()}
      </p>
    </div>
  </div>
</aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Villages Management</h1>
                  <p className="text-gray-600">Manage and monitor all villages under the water management system</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Village</span>
                </button>
              </div>
            </div>

            {/* Villages Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">All Villages</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  <p className="mt-2 text-gray-600">Loading villages data...</p>
                </div>
              ) : villages.length === 0 ? (
                <div className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-600">No villages found. Add your first village.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Village Details</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">District & Taluka</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">State</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Population</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {villages.map((v) => (
                        <tr key={v.village_id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{v.village_name}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <Hash className="h-4 w-4" />
                                <span>Pincode: {v.pincode || "N/A"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{v.district}</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                Taluka: {v.taluka || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {v.state}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold">{v.population?.toLocaleString() || "0"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditing(v);
                                  setForm({
                                    village_name: v.village_name || "",
                                    district: v.district || "",
                                    taluka: v.taluka || "",
                                    state: v.state || "",
                                    pincode: v.pincode || "",
                                    population: v.population?.toString() || "",
                                  });
                                  setShowModal(true);
                                }}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => setConfirmDelete(v.village_id)}
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
                <MapPin className="h-5 w-5 text-blue-700 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Accurate village data is essential for effective water resource planning. 
                    Ensure all demographic and geographic information is up-to-date for optimal service delivery.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Village Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editing ? "Edit Village Details" : "Register New Village"}
                    </h2>
                    <p className="text-sm text-gray-600">Fill in the village information below</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    setForm({
                      village_name: "",
                      district: "",
                      taluka: "",
                      state: "",
                      pincode: "",
                      population: "",
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
                    Village Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter village name"
                    value={form.village_name}
                    onChange={(e) =>
                      setForm({ ...form, village_name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      placeholder="Enter district"
                      value={form.district}
                      onChange={(e) =>
                        setForm({ ...form, district: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taluka
                    </label>
                    <input
                      type="text"
                      placeholder="Enter taluka"
                      value={form.taluka}
                      onChange={(e) =>
                        setForm({ ...form, taluka: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({ ...form, pincode: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Population
                  </label>
                  <input
                    type="number"
                    placeholder="Enter population"
                    value={form.population}
                    onChange={(e) =>
                      setForm({ ...form, population: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    setForm({
                      village_name: "",
                      district: "",
                      taluka: "",
                      state: "",
                      pincode: "",
                      population: "",
                    });
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVillage}
                  className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center space-x-2"
                >
                  <Check className="h-5 w-5" />
                  <span>{editing ? "Update Village" : "Register Village"}</span>
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
                  <p className="text-gray-600">Are you sure you want to delete this village?</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All village data, including associated pumps and tanks, will be permanently deleted.
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
                  <span>Delete Village</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}