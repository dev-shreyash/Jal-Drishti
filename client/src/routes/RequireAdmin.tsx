import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// 👇 FIX: Use 'React.ReactNode' instead of 'JSX.Element'
interface RequireAdminProps {
  children: React.ReactNode; 
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const location = useLocation();
  
  // 1. Get Token from Storage
  const token = localStorage.getItem("token");
  
  // 2. Decode Token (Optional: Check role if you store it)
  // For now, we simply check if a token exists. 
  // In a real app, you might decode the JWT to check `role === 'ADMIN'`
  
  if (!token) {
    // Redirect to Login if not authenticated
    // State ensures they go back to the page they tried to visit after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Render the protected content
  return <>{children}</>;
};

export default RequireAdmin;