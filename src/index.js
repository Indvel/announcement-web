import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './layout/App';
import Header from './layout/Header';
import { GlobalProvider } from './GlobalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <GlobalProvider>
    <Header/>
    <App/>
  </GlobalProvider>
  </>
);

