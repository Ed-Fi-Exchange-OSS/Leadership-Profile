// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';
import PrivateRoute from './utils/PrivateRoute';
import LoggedInRoute from './utils/LoggedInRoute';
import Navigation from './components/Navigation';
import Login from './components/LoginComponents/Login';
import Directory from './components/DirectoryComponents/Directory';
import VacancyReport from './components/VacancyReport/VacancyReport';
import VacancyReportDetails from './components/VacancyReportDetails/VacancyReportDetails';
import LandingPage from './components/LandingPageComponents/LandingPage';
import IdentifyLeaders from './components/IdentifyLeaders/IdentifyLeaders';
import Profile from './components/ProfileComponents/Profile';
import Registration from './components/LoginComponents/Registration';
import AuthService from './utils/auth-service';
import ForgotPassword from './components/LoginComponents/ForgotPassword';
import ResetPassword from './components/LoginComponents/ResetPassword';
import FilterContextProvider from './context/filters/FilterContextProvider';

function App() {
  const { isAuthenticated } = AuthService();
  const authenticated = isAuthenticated();

  return (
    <div className="App">
      <Navigation />
      <Router>
        <React.Fragment>
          <div className="body">
                <FilterContextProvider>
                  <LoggedInRoute exact path='/account/login' isAuthenticated={authenticated} component={Login} />
                  <Route exact path="/">
                    {/* <Redirect to="/directory?page=1&sortBy=asc&sortField=id" /> */}
                    <Redirect to="/landing" />
                  </Route>
                  {/* <PrivateRoute exact path="/:searchParams" isAuthenticated={authenticated} component={LandingPage} /> */}
                  <PrivateRoute exact path="/directory" isAuthenticated={authenticated} component={Directory} />
                  <PrivateRoute exact path="/landing" isAuthenticated={authenticated} component={LandingPage} />
                  <Route path="/profile/:id" isAuthenticated={authenticated} component={Profile} />
                </FilterContextProvider>
                <PrivateRoute path="/advanced/search">
                  <Redirect to="/directory?page=1&sortBy=asc&sortField=id" />
                </PrivateRoute>
                <Route exact path="/account/register" component={Registration} />
                <Route exact path="/vacancy-report" component={VacancyReport} />
                <Route exact path="/vacancy-report-detail" component={VacancyReportDetails} />
                <Route exact path="/identify-leaders" component={IdentifyLeaders} />
                <Route exact path="/account/forgotpassword" component={ForgotPassword} />
                <Route exact path="/account/resetpassword" component={ResetPassword} />
          </div>
        </React.Fragment>
      </Router>
    </div>
  );
}
export default App;
