import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import axios from 'axios';

const Bills = () => {   
    const [bills, setBills] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {   
        axios.get("/erp/bills").then(({ data }) => {
            setBills(data.reverse());
            setAction("");
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" }, 
        { body: "dateFormat", header: "Bill Date"},
        { body: "dateThirdFormat", header: "Due Date"},
        { field: "total", filter: "total", header: "₱Total" }, 
        { body: "paymentStatus", header: "Payment" }, 
        { body: "state", header: "State" }, 
    ]

    return (
        <CustomTable name={"Bill"} columns={columns} dataValue={bills} setAction={setAction} />
    )
}

export default Bills;