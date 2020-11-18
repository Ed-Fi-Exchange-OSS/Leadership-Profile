import React, { Component } from 'react';
import Navigation from './Navigation';
import Directory from './Directory';

class Layout extends Component {
    render() {
      return (
        <div>
            <Navigation />
            <Directory />
        </div>
      );
    }
  }

  export default Layout;
