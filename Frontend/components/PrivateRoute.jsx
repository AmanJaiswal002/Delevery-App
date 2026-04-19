import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
