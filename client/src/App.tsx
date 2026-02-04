import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import OperatorDailyLog from "./pages/dashboard/operator/OperatorDailyLog";
import OperatorLogs from "./pages/dashboard/operator/OperatorLogs";

/* ADMIN */
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

/* OPERATOR */
import OperatorDashboard from "./pages/dashboard/operator/OperatorDashboard";

/* GUARDS */
import RequireAdmin from "./routes/RequireAdmin";
import RequireOperator from "./routes/RequireOperator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* LOGIN */}
        <Route path="/auth/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        {/* OPERATOR */}
        <Route
          path="/operator/dashboard"
          element={
            <RequireOperator>
              <OperatorDashboard />
            </RequireOperator>
          }
        />
      <Route path="/operator/daily-log" element={
  <RequireOperator>
    <OperatorDailyLog />
  </RequireOperator>
} />

<Route path="/operator/logs" element={
  <RequireOperator>
    <OperatorLogs />
  </RequireOperator>
} />

      </Routes>
    </BrowserRouter>
  );
}
