import React from 'react';
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
import Profile from './components/ProfileComponents/Profile';
import Registration from './components/LoginComponents/Registration';
import AuthService from './utils/auth-service';
import RoleManagement from './components/RoleMangementComponents/RoleManagement';
import ForgotPassword from './components/LoginComponents/ForgotPassword';
import ResetPassword from './components/LoginComponents/ResetPassword';

function App() {
  const { isAuthenticated } = AuthService()
  const authenticated = isAuthenticated();

  return (
    <div className="App">
      <Navigation />
      <Router>
        <React.Fragment>
          <div className="body">
            <LoggedInRoute exact path='/account/login' isAuthenticated={authenticated} component={Login} />
            <Route exact path="/">
              <Redirect to="/directory?page=1&sortBy=desc&sortField=id" />
            </Route>
            <PrivateRoute exact path="/:searchParams" isAuthenticated={authenticated} component={Directory} />
            <PrivateRoute path="/profile/:id" isAuthenticated={authenticated} component={Profile} />
            <PrivateRoute path="/admin/:searchParams" isAuthenticated={authenticated} component={RoleManagement} /> {/* add isAdmin to auth */}
            <Route exact path="/account/register" component={Registration} />
            <Route exact path="/account/register" component={Registration} />            
            <Route exact path="/account/forgotpassword" component={ForgotPassword} />
            <Route exact path="/account/resetpassword" component={ResetPassword} />
          </div>
        </React.Fragment>
      </Router>
    </div>
  );
}

export default App;
