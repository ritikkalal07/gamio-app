import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../utils/auth';
 
function ProtectedRoute() {
  return auth.isAdmin() ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;