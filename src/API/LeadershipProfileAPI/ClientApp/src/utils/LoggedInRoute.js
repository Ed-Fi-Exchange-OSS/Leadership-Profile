import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const LoggedInRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated
      // ? <Redirect to={{ pathname: '/queue?count=10&page=1&sortBy=asc&sortField=id', state: { from: props.location } }} />
      ? <Redirect to={{ pathname: '/landing', state: { from: props.location } }} />
      : <Component {...rest} />)
    }
  />
);

export default LoggedInRoute;
