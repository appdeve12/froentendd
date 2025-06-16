// src/components/routing/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const token = useSelector(state => state.auth.token);
console.log("login toekn",token)
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
