import React, { useEffect, useState }  from 'react';
import CustomTable from '../../components/CustomTable';
import axios from "axios";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        axios.get("/erp/customers").then(({ data }) => {
            setCustomers(data);
            setAction(data);
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "name", filter: "name", header: "Name" }, 
        { field: "business", filter: "business", header: "Business" }, 
        { body: "addressFormat", header: "Address" }, 
        { field: "contact.phoneNumber", filter: "contact.phoneNumber", header: "Contact" }, 
    ]

    return (
        <CustomTable name={"Customer"} columns={columns} dataValue={customers} setAction={setAction} />
    )
}

export default Customers;