import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, MapPin, Loader2, Droplets, Key } from "lucide-react";
import api from "../../services/api";
import { getVillages } from "../../services/village";

interface Village {
  village_id: number;
  village_name: string;
  district: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    contact_number: "",
    email: "",
    village_id: "",
    secret_key: "",
  });

  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingVillages, setIsFetchingVillages] = useState(true);
  const [error, setError] = useState("");

  // Load Villages on Mount
  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components
    const loadInitialData = async () => {
      try {
        const data = await getVillages();
        if (isMounted) {
          // Ensure data is an array before setting state
          setVillages(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to fetch villages. Please refresh the page.");
        }
      } finally {
        if (isMounted) setIsFetchingVillages(false);
      }
    };
    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation before sending
    if (!formData.village_id) {
      setError("Please select a village.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        ...formData,
        village_id: Number(formData.village_id),
      });

      if (response.data) {
        navigate("/login");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed. Check your Secret Key.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-white/20 p-3 rounded-full">
              <Droplets className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Create Admin Account</h2>
          <p className="text-blue-100 text-sm mt-1">Official Personnel Only</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Village Selector - Fixed with Icon wrapper */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Assigned Village
              </label>
              <div className="relative">
                <select
                  name="village_id"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700 disabled:bg-gray-100"
                  value={formData.village_id}
                  onChange={handleChange}
                  disabled={isFetchingVillages}
                >
                  {isFetchingVillages ? (
                    <option>Loading villages...</option>
                  ) : (
                    <>
                      <option value="">-- Choose Your Village --</option>
                      {villages.map((v) => (
                        <option key={v.village_id} value={v.village_id}>
                          {v.village_name} ({v.district})
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Secret Key Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="secret_key"
                  required
                  placeholder="Enter official admin code"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                  value={formData.secret_key}
                  onChange={handleChange}
                />
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Name & Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  name="contact_number"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                  value={formData.contact_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Username & Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isFetchingVillages}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
              Register Admin
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/admin/login" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}