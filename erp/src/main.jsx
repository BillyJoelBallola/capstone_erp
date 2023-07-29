import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from "./context/UserContext";
import axios from 'axios';

import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";    
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>,
)
