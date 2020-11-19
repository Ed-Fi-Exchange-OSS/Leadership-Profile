import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';
import Navigation from './components/Navigation';
import Directory from './components/Directory';
import Profile from './components/Profile';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Router>
        <Switch>
          <div className="body">
            <Route exact path="/" component={Directory} />
            {/* add :id when we have api feeding it */}
            <Route path="/profile" component={Profile} />
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
