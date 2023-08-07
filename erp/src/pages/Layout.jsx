import React, { useContext } from 'react';
import Header from '../components/Header';
import { Outlet } from "react-router-dom";
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';

const Layout = () => {
    const { loading } = useContext(UserContext);

    return (
        <div className='relative'>
            { loading && <Loader /> }
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;