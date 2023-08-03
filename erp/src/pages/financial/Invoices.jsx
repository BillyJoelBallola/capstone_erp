import React, { useEffect, useState } from 'react';
import axios from "axios";
import CustomTable from '../../components/CustomTable';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        axios.get("/erp/invoices").then(({ data }) => {
            setInvoices(data.reverse());
            setAction("");
        }) 
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "customer.name", filter: "customer.name", header: "Customer" }, 
        { body: "dateFormat", header: "Invoice Date"},
        { body: "dateThirdFormat", header: "Due Date"},
        { field: "total", filter: "total", header: "₱Total" }, 
        { body: "paymentStatus", header: "Payment" }, 
        { body: "state", header: "State" }, 
    ]

    return (
        <CustomTable name={"Invoice"} columns={columns} dataValue={invoices} setAction={setAction} />
    )
}

export default Invoices;