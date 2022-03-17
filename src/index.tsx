import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './styles';

ReactDOM.render(
  <React.StrictMode>
    {/* <HashRouter basename="/"> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </HashRouter> */}
  </React.StrictMode>,
  document.getElementById('root')
);
