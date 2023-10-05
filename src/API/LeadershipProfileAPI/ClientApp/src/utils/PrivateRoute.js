// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
