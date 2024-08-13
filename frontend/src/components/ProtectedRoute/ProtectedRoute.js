import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element: Component }) => {
  const isloggedIn = useSelector((state) => state.isloggedIn); // Fetch the logged-in status from Redux

  return isloggedIn ? <Component /> : <Navigate to="/please-login" />;
};

export default ProtectedRoute;
