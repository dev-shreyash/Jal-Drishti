import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Jal Drishti</h1>
                <p className="tagline">Water Management & Monitoring System</p>
            </header>

            <section className="info-section">
                <div className="info-card text-gray-500">
                    <h2>About Jal Drishti</h2>
                    <p>
                        Jal Drishti is a comprehensive water management and monitoring platform designed to help
                        administrators and operators efficiently manage water resources and track system performance.
                    </p>
                </div>

                <div className="features text-gray-500">
                    <h2>Features</h2>
                    <ul>
                        <li>Real-time water level monitoring</li>
                        <li>System performance analytics</li>
                        <li>User management and access control</li>
                        <li>Automated alerts and notifications</li>
                    </ul>
                </div>
            </section>

            <section className="auth-section">
                <h2>Get Started</h2>
                <div className="button-group">
                    <button
                        className="btn btn-admin"
                        onClick={() => navigate('/admin/login')}
                    >
                        Admin Login
                    </button>
                    <button
                        className="btn btn-operator"
                        onClick={() => navigate('/operator/login')}
                    >
                        Operator Login
                    </button>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; 2025 Jal Drishti. All rights reserved.</p>
            </footer>
        </div>
    );
}