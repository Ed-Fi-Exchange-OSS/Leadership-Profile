// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
