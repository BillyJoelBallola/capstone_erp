import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { useParams } from 'react-router-dom';

// TODO: fix payments table for invoices and bills

const Payments = () => {
    const entity = useParams().entity;
    const [customerPayments, setCustomerPayments] = useState([]);
    const [supplierPayments, setSupplierPayments] = useState([]);
    const [action, setAction] = useState([]);

    useEffect(() => {
        axios.get("/erp/payments").then(({ data }) => {
            setCustomerPayments(data.filter(item => { if(item.customer) return item }));
            setSupplierPayments(data.filter(item => { if(item.supplier) return item }));
            setAction("");
        })
    }, [action, entity])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "journal", filter: "journal", header: "Journal" }, 
        { field: "method", filter: "method", header: "Payment Method" }, 
        { 
            field: `${entity === "suppliers" ? 
                "supplier.business" : "customer.business"}`, 
            filter: `${entity === "suppliers" ? 
                "supplier.business" : "customer.business"}`, 
            header: `${entity === "suppliers" ? 
                "Supplier" : "Customer"}` 
        }, 
        { body: "dateFormat", header: "Payment Date"},
        { field: "amount", filter: "amount", header: "₱Amount" },
    ]

    return (
        <CustomTable name={"Payment"} dataValue={entity === "customers" ? customerPayments : supplierPayments} setAction={setAction} columns={columns} />
    )
}

export default Payments;