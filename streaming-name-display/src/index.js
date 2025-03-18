import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import DisplayPage from './pages/DisplayPage';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/AppContext';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if this is a display page by checking URL parameters
const urlParams = new URLSearchParams(window.location.search);
const isDisplayPage = urlParams.get('display') === 'true';

// Render the appropriate component based on the URL
root.render(
  <React.StrictMode>
    <AppProvider>
      {isDisplayPage ? <DisplayPage /> : <App />}
    </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
