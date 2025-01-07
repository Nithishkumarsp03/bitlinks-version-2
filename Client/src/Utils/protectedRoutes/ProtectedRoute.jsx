import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // If role is not allowed, redirect to a 404 or unauthorized page
    return <Navigate to="/404" />;
  }

  // If role is allowed, render the children
  return children;
};

export default ProtectedRoute;
