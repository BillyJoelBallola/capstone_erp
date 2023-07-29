import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [action, setAction] = useState([]);

    useEffect(() => {
        axios.get("/erp/payments").then(({ data }) => {
            setPayments(data.reverse());
            setAction("");
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "journal", filter: "journal", header: "Journal" }, 
        { field: "method", filter: "method", header: "Payment Method" }, 
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" }, 
        { body: "dateFormat", header: "Payment Date"},
        { field: "amount", filter: "amount", header: "₱Amount" },
    ]

    return (
        <CustomTable name={"Payment"} dataValue={payments} setAction={setAction} columns={columns} />
    )
}

export default Payments;