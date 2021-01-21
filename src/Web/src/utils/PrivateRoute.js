import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Login from '../components/LoginComponents/Login';

const PrivateRoute = ({ isAuthenticated, component, ...options }) => {
  const finalComponent = isAuthenticated ? component : Login;
  console.log(options);

  return <Route {...options} component={finalComponent} />;
};

export default PrivateRoute;
