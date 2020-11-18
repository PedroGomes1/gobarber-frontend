import React from 'react';

import { BrowserRouter as Route } from 'react-router-dom';

import Router from './routes';
import GlobalStyle from './styles/global';

import AppProvider from './hooks';

const App: React.FC = () => (
  <>
    <Route>
      <AppProvider>
        <Router />
      </AppProvider>

      <GlobalStyle />
    </Route>
  </>
);

export default App;
