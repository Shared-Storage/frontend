import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const UnprotectedRoute = ({ children }) => {
  // const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => {
    return state.auth.isAuthenticated;
  });
  let location = useLocation();
  if (isAuth && isAuth !== undefined) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
};

export default UnprotectedRoute;
