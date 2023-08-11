import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { UserContext } from '../../context/UserContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [action, setAction] = useState([]);
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/orders").then(({ data }) => {
            setOrders(data.reverse());
            setLoading(false);
            setAction("");
        })
    }, [action]);

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "customer.name", filter: "customer.name", header: "Customer" }, 
        { field: "customer.business", filter: "customer.business", header: "Business" }, 
        { field: "total", filter: "total", header: "₱Total" }, 
        { body: "orderState", header: "" }, 
    ]
    
    return (
        <CustomTable name={"Order"} dataValue={orders} columns={columns} setAction={setAction} metaKey={true}/>
    )
}

export default Orders;