import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Detect User Type from URL (e.g. /login/operator vs /login/admin)
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
            // 2. Set Endpoint
            const endpoint = isOperator 
                ? 'http://localhost:3000/auth/operator/login' 
                : 'http://localhost:3000/auth/admin/login'; 

            console.log(`Attempting login to: ${endpoint}`);

            // 3. Make API Call
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // 4. Store Data
            console.log("Login Successful! Saving token...");
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(isOperator ? data.operator : data.admin));
            localStorage.setItem('role', userType.toUpperCase()); 

            // 5. Navigate to the correct Dashboard
            // This is the logic that redirects you
            if (isOperator) {
                console.log("Redirecting to Operator Dashboard...");
                navigate('/operator/dashboard');
            } else {
                console.log("Redirecting to Admin Dashboard...");
                navigate('/admin/dashboard');
            }

        } catch (err: unknown) {
            console.error("Login Error:", err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>{userType} Login</h2>
                    <p>Enter your credentials to access Jal Drishti</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required 
                            className=' text-gray-500'
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required 
                            className=' text-gray-500'
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <span onClick={() => navigate('/register')}>Sign Up</span></p>
                    <p>Back to <span onClick={() => navigate('/')}>Home</span></p>
                </div>
            </div>
        </div>
    );
}