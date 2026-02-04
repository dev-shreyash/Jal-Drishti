import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, MapPin, Loader2, Droplets, Key } from "lucide-react"; // 1. Added Key icon
import api from "../../services/api";

interface Village {
  village_id: number;
  village_name: string;
  district: string;
}

export default function Register() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    contact_number: "",
    email: "",
    village_id: "",
    secret_key: "", // 2. Added secret_key to state
  });

  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Load Villages on Mount
  useEffect(() => {
    api.get("/auth/villages")
      .then((res) => setVillages(res.data))
      .catch(() => setError("Failed to load village list. Is the backend running?"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send data to backend
      const response = await api.post("/auth/register", {
        ...formData,
        village_id: Number(formData.village_id), // Ensure number
        // Backend handles hashing, we just send the plain data + secret key
      });

      if (response.data) {
        // Success! Redirect to Login
        navigate("/login");
      }
    } catch (err: unknown) {
      let errorMessage: string | undefined;
      if (err instanceof Object && 'response' in err) {
        const errObj = err as { response?: { data?: { message?: string } } };
        // Note: Your admin controller returns 'message', not 'error'
        errorMessage = errObj.response?.data?.message; 
      }
      setError(errorMessage || "Registration failed. Check your Secret Key.");
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

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Village Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Village</label>
              <div className="relative">
                <select
                  name="village_id"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
                  value={formData.village_id}
                  onChange={handleChange}
                >
                  <option value="">-- Choose Your Village --</option>
                  {villages.map((v) => (
                    <option key={v.village_id} value={v.village_id}>
                      {v.village_name} ({v.district})
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 3. NEW: Secret Key Input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Secret Key</label>
              <div className="relative">
                <input
                  type="password"
                  name="secret_key"
                  required
                  placeholder="Enter official admin code"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-gray-700"
                  onChange={handleChange}
                />
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Name & Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-gray-700"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Phone</label>
                <input
                  type="text"
                  name="contact_number"
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-gray-700"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-gray-700"
                onChange={handleChange}
              />
            </div>

            {/* Username & Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Username</label>
              <input
                type="text"
                name="username"
                required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-gray-700"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none text-gray-700"
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
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