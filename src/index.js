import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const localApiUrl = 'http://localhost:5000';
const apiUrl = (process.env.REACT_APP_API_URL || localApiUrl).replace(/\/$/, '');

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith(localApiUrl)) {
    config.url = `${apiUrl}${config.url.slice(localApiUrl.length)}`;
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
