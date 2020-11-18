import React, { Component } from 'react';
import Navigation from './Navigation';
import Directory from './Directory';
import Profile from './Profile';

class Layout extends Component {
    render() {
      return (
        <div>
            <Navigation />
            {/* <Directory /> */}
            <Profile />
        </div>
      );
    }
  }

  export default Layout;
