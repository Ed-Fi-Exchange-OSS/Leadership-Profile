import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
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

function App() {
  const { isAuthenticated } = AuthService()
  const authenticated = isAuthenticated();
  console.log(authenticated);

  return (
    <div className="App">
      <Navigation />
      <Router>
          {/* <Switch> */}
            <React.Fragment>
              <div className="body">
                {/* <LoggedInRoute exact path='/account/login' isAuthenticated={authenticated} component={Login} /> */}
                <Route exact path="/">
                  <Redirect to="/directory?page=1&sortBy=desc&sortField=id" />
                </Route>
                <Route exact path="/:searchParams" isAuthenticated={authenticated} component={Directory} />
                <Route path="/profile/:id" isAuthenticated={authenticated} component={Profile} />
                <Route exact path="/account/login" component={Login} />
                {/* <Route exact path="/account/register" component={Registration} /> */}
              </div>
            </React.Fragment>
          {/* </Switch> */}
      </Router>
    </div>
  );
}

export default App;
