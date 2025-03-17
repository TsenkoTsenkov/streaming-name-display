import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import DisplayPage from './pages/DisplayPage';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/AppContext';

// Determine which component to render based on URL
const urlParams = new URLSearchParams(window.location.search);
const isDisplayMode = urlParams.get('display') === 'true';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      {isDisplayMode ? <DisplayPage /> : <App />}
    </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
