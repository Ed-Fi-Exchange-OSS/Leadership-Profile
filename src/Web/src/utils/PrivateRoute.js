import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated
      ? <Component {...props} {...rest} />
      : <Redirect to={{ pathname: '/login', state: { prevLocation: props.location.pathname } }} />)}
  />
);

export default PrivateRoute;
