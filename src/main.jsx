import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import your custom global styles if needed
import './index.css'; // optional – only if you still have global overrides

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
