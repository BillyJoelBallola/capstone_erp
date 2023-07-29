import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [action, setAction] = useState([]);

    useEffect(() => {
        axios.get("/erp/orders").then(({ data }) => {
            setOrders(data.reverse());
            setAction("");
        })
    }, [action]);

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "customer.name", filter: "customer.name", header: "Customer" }, 
        { field: "total", filter: "total", header: "₱Total" }, 
        { body: "orderState", header: "" }, 
    ]

    return (
        <CustomTable name={"Order"} dataValue={orders} columns={columns} setAction={setAction}/>
    )
}

export default Orders;