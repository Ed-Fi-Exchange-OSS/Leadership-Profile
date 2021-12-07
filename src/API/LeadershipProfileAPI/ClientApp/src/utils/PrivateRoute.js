import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Login from '../components/LoginComponents/Login';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated
      ? <Component {...rest} />
      : <Redirect to={{ pathname: '/account/login'}} />)
    }
  />
);

export default PrivateRoute;
