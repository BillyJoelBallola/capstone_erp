import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Sales = () => {
    const [orders, setOrders] = useState(0);
    const [customers, setCustomers] = useState(0);
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/orders").then(({ data }) => {
            setOrders(data?.filter(order => order.state <= 2 && order.invoice <= 3)?.length);
            setLoading(false);
        });
        axios.get("/erp/customers").then(({ data }) => {
            setCustomers(data?.filter(customer => customer.state === 1)?.length);
            setLoading(false);
        });
    }, [])
    
    return (
        <div>
            <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                <span className="md:text-lg font-semibold">Sales Overview</span>
            </div>
            <div className='pt-28 pb-10 px-6'>
                <div className='grid md:grid-cols-3 gap-4 mb-6'>
                    <div className='grid gap-4 bg-white border border-gray-300 p-4 border-r-red-400 border-r-4'>
                        <span className='text-lg font-semibold'>Orders</span>
                        <NavLink to="/sales/orders" className="btn-dark-gray max-w-min whitespace-nowrap px-4">{orders} to Process</NavLink>
                    </div>
                    <div className='grid gap-4 bg-white border border-gray-300 p-4 border-r-blue-400 border-r-4'>
                        <span className='text-lg font-semibold'>Customers</span>
                        <NavLink to="/sales/customers" className="btn-dark-gray max-w-min whitespace-nowrap px-4">{customers} to Process</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sales;