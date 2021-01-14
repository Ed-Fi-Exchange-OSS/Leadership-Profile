import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const LoggedInRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated
      ? <Redirect to={{ pathname: '/directory?page=1&sortBy=desc&sortField=id', state: { from: props.location } }} />
      : <Component {...props} {...rest} />)
    }
  />
);

export default LoggedInRoute;
