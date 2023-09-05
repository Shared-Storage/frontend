import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedEmailVerifyRoute = ({ children }) => {
  // const user = useSelector((state) => state.user);
  const emailVerified = useSelector((state) => {
    return state.user.emailVerified;
  });
  let location = useLocation();
  if (!emailVerified && emailVerified !== undefined) {
    return (
      <Navigate to="/email-not-verified" state={{ from: location }} replace />
    );
  }
  return children;
};

export default ProtectedEmailVerifyRoute;
