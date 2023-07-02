import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
const RestrictedAuth = ({ children, rest }) => {
  let auth = { token: false };
  return auth.token ? <Outlet /> : <Navigate to='/dashboard' />;
};

export default RestrictedAuth;
