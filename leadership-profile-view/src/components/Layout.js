import React, { Component } from 'react';
import Navigation from './Navigation';
import List from './List';

class Layout extends Component {
    render() {
      return (
        <div>
            <Navigation />
            <List />
        </div>
      );
    }
  }

  export default Layout;
