import React from 'react';
import { Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Preview from './pages/Preview';
import CheckOut from './pages/CheckOut';
import Tracker from './pages/Tracker';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/account/:tab?/:sub?' element={<Account />} />
                <Route path='/preview/:id?' element={<Preview />} />
                <Route path='/check_out' element={<CheckOut />} />
                <Route path='/tracker' element={<Tracker />} />
            </Route>
        </Routes>
    )
}

export default App;
