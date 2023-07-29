import React from 'react';
import ReactDOM from 'react-dom/client';

import { CustomerContextProvider } from './context/CustomerContext.jsx';
import { BrowserRouter } from "react-router-dom";

import App from './App.jsx';
import axios from "axios";

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";    
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CustomerContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CustomerContextProvider>
    </React.StrictMode>,
)
