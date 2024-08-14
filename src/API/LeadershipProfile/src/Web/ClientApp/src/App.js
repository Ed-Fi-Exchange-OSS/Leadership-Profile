import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import FilterContextProvider from './context/filters/FilterContextProvider';

// import './custom.css';
import './App.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <FilterContextProvider>
          <Routes>          
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </FilterContextProvider>
      </Layout>
    );
  }
}
