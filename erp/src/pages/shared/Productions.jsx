import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const Productions = () => {
    const [production, setProduction] = useState([]);
    const [action, setAction] = useState("");
   
    useEffect(() => {
        axios.get("/erp/productions").then(({ data }) => {
            setProduction(data.reverse());
            setAction("")
        })
    }, [action])

    const columns = [
        { selectionMode: true, },
        { field: "reference", filter: "reference", header: "Code" },
        { field: "product.name", filter: "product.name", header: "Product Name" }, 
        { field: "quantity", filter: "quantity", header: "Quantity" },
        { body: "dateFormat", header: "Date" },
        { body: "state", header: "State" },
    ]
    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Production"} dataValue={production} columns={columns} setAction={setAction}/>
        </>
    )
}

export default Productions