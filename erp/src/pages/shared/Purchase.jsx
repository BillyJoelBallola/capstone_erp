import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [action, setAction] = useState("");
   
    useEffect(() => {
        axios.get("/erp/purchases").then(({ data }) => {
            setPurchases(data.reverse());
            setAction("")
        })
    }, [action])

    const columns = [
        { selectionMode: true, },
        { field: "reference", filter: "reference", header: "Code" },
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" },
        { body: "dateFormat", header: "Order Date" },
        { body: "dateThirdFormat", header: "Expected Arrival" },
        { field: "total",  filter: "total", header: "₱ Total" },
        { body: "state", header: "State" },
    ]
    
    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Purchase"} dataValue={purchases} columns={columns} setAction={setAction}/>
        </>
    )
}

export default Purchase;