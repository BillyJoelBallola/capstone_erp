import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { UserContext } from '../../context/UserContext';


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [action, setAction] = useState([]);
    const { setLoading } = useContext(UserContext);

    // const compareFunction = (a, b) => {
    //     if (a.state === 2 && b.state === 2) {
    //       return 0;
    //     }
    
    //     if (a.state === 2) {
    //       return -1;
    //     }
    
    //     if (b.state === 2) {
    //       return 1;
    //     }
    
    //     return 0;
    // };

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
        <CustomTable name={"Order"} dataValue={orders} columns={columns} setAction={setAction}/>
    )
}

export default Orders;