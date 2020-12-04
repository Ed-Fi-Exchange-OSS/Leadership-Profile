import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './App.css';
import Navigation from './components/Navigation';
import Directory from './components/DirectoryComponents/Directory';
import Profile from './components/Profile';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Router>
          <Switch>
          <div className="body">
            <Route exact path="/">
              <Redirect to="/directory?page=1&sortBy=desc&sortField=id" />
            </Route>
            <Route exact path="/:parameters" component={Directory} />
            <Route path="/profile/:id" component={Profile} />
          </div>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
