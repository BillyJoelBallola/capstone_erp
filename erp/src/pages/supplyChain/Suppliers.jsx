import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        axios.get("/erp/suppliers").then(({ data }) => {
            setSuppliers(data.reverse());
            setAction("");
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "name", filter: "name", header: "Name" }, 
        { field: "business", filter: "business", header: "Supplier" }, 
        { field: "contact.phoneNumber", filter: "contact.phoneNumber", header: "Phone" }, 
        { field: "contact.email", filter: "contact.email", header: "Email" }, 
        { field: "address.municipal", filter: "address.municipal", header: "Municipal" }, 
        { field: "address.province", filter: "address.province", header: "Province" }, 
    ]

    return (
        <CustomTable name={"Supplier"} dataValue={suppliers} columns={columns} setAction={setAction}/>
    )
}

export default Suppliers;   