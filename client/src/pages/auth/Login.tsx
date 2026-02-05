import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Droplet, Lock, User, ArrowRight } from 'lucide-react';
import api from '../../services/api'; // Import your new axios instance
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isOperator = location.pathname.includes('operator');
  const userType = isOperator ? 'Operator' : 'Admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isOperator 
        ? '/auth/operator/login' 
        : '/auth/admin/login'; 

      // Axios handles the stringify and the response parsing automatically
      const response = await api.post(endpoint, { username, password });
      
      const data = response.data;

      // 4. Store Data
      localStorage.setItem('token', data.token);
      localStorage.setItem('village_name', data.village_name || 'Village Admin');
      localStorage.setItem('role', userType.toUpperCase());
      localStorage.setItem('user', JSON.stringify(isOperator ? data.operator : data.admin));

      // 5. Navigate
      if (isOperator) {
        navigate('/operator/dashboard');
      } else {
        navigate('/admin/dashboard');
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      // Axios puts the server error response inside err.response.data
      const message = err.response?.data?.error || err.response?.data?.message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container bg-gradient-to-br from-blue-600 to-blue-800 min-h-screen flex items-center justify-center p-4">
      <div className="login-card bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        <div className="bg-white p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-xl mb-4">
            <Droplet className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {userType} Login
          </h2>
          <p className="text-gray-500 mt-2">Jal-Drishti Water Management System</p>
        </div>

        <div className="p-8 pt-4">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <User className="h-5 w-5" />
                </span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  placeholder="Enter username"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              disabled={loading}
            >
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate(isOperator ? '/admin/login' : '/operator/login')}
              className="text-sm text-blue-600 font-bold hover:underline"
            >
              Switch to {isOperator ? 'Admin' : 'Operator'} Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}