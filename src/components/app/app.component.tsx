import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Header from '../header/header.component';
import MainContent from '../../pages/main-content/main-content.page';

import './app.component.scss';
import '../../common/styles/index';

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <Header />
        <MainContent />
      </Router>
    </div>
  );
};

export default App;
