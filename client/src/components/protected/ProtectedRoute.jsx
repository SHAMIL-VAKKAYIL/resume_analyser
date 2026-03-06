import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


export default function RoleRoute({ children, roles = [] }) {
  const { user, initialized } = useSelector(state => state.auth);



  // if (!initialized) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.includes(user.role))
    return <div>Forbidden - You do not have access</div>;

  return children || <Outlet />;
}
