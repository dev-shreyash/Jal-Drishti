import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home"; // Ensure filename case matches your system (Home vs home)

/* ADMIN IMPORTS */
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

/* OPERATOR IMPORTS */
import OperatorDashboard from "./pages/dashboard/operator/OperatorDashboard";
import OperatorDailyLog from "./pages/dashboard/operator/OperatorDailyLog";
import OperatorLogs from "./pages/dashboard/operator/OperatorLogs";

/* GUARDS */
import RequireAdmin from "./routes/RequireAdmin";
import RequireOperator from "./routes/RequireOperator";
import DataSimulation from "./component/DataSimulation";
import Register from "./pages/auth/Register";
import Assets from "./pages/dashboard/admin/Assets";
import AdminLayout from "./pages/dashboard/admin/AdminLayout";
import Operators from "./pages/dashboard/admin/Operators";
import Complaints from "./pages/dashboard/admin/Complaints&status";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Home />} />

        {/* --- FIX: DEFINE EXACT LOGIN ROUTES --- */}
        {/* These match the redirects and the logic in Login.tsx */}
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/operator/login" element={<Login />} />

      <Route 
        path="/admin" 
        element={
          <RequireAdmin>
            <AdminLayout /> {/* Layout renders Sidebar & Header */}
          </RequireAdmin>
        }
      >
        {/* Child Routes (Render inside Layout's <Outlet />) */}
        {/* URL becomes: /admin/dashboard */}
        <Route path="dashboard" element={<AdminDashboard />} />
        
     
        {/* URL becomes: /admin/assets */}
        <Route path="assets" element={<Assets />} />

        <Route path="operators"  element={<Operators />} />

        <Route path="complaints" element={<Complaints />} />
        
        {/* Default redirect: /admin -> /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

        {/* OPERATOR DASHBOARD (Protected) */}
        <Route
          path="/operator/dashboard"
          element={
            <RequireOperator>
              <OperatorDashboard />
            </RequireOperator>
          }
        />
        <Route
          path="/operator/daily-log"
          element={
            <RequireOperator>
              <OperatorDailyLog />
            </RequireOperator>
          }
        />
        <Route
          path="/operator/logs"
          element={
            <RequireOperator>
              <OperatorLogs />
            </RequireOperator>
          }
        />

        <Route path="/simulation" element={<DataSimulation />} />

          <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
      
    </BrowserRouter>
  );
}