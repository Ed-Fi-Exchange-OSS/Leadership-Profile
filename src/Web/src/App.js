import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';
import Navigation from './components/Navigation';
import Login from './components/LoginComponents/Login';
import Directory from './components/DirectoryComponents/Directory';
import Profile from './components/ProfileComponents/Profile';
import Registration from './components/LoginComponents/Registration';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Router>
          <Switch>
          <div className="body">
            <Route path="/">
              <Redirect to="/directory?page=1&sortBy=desc&sortField=id" />
            </Route>
            <Route exact path="/directory?:parameters" component={Directory} />
            <Route path="/profile/:id" component={Profile} />
            {/* temporary routing until we have private routes and loggedinroute */}
            <Route exact path="/login/login" component={Login} />
            <Route exact path="/login/register" component={Registration} />
          </div>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
