import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user.role))
    return <Navigate to="/forbidden" />;

  return children;
};

export default ProtectedRoute;
