import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastProvider } from 'react-toast-notifications';
import './index.css';

ReactDOM.render(
  <ToastProvider placement="top-right" autoDismiss={true} autoDismissTimeout={1500}>
    <App />
  </ToastProvider>,
  document.getElementById('root')
);
