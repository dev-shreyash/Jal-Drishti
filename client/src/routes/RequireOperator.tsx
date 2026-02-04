import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const RequireOperator = ({ children }: Props) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || role !== "operator") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireOperator;
