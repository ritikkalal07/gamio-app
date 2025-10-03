import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Read user_type directly from localStorage
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  // Allow access only if logged in AND admin
  if (token && userType === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;

// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { auth } from '../utils/auth';
 
// function ProtectedRoute() {
//   return auth.isAdmin() ? <Outlet /> : <Navigate to="/login" />;
// }

// export default ProtectedRoute;