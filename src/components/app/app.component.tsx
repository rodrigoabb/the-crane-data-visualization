import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import Header from '../header/header.component';
import MainContent from '../../pages/main-content/main-content.page';
import client from '../../common/api/apollo-client';

import './app.component.scss';
import '../../common/styles/index';

const App: React.FC = () => {
  return (
    <ApolloProvider client={ client }>
        <Router>
          <Header />
          <MainContent />
        </Router>
    </ApolloProvider>
  );
};

export default App;
