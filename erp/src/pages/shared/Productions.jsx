import React, { useContext, useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const Productions = () => {
    const [production, setProduction] = useState([]);
    const [action, setAction] = useState("");
    const { setLoading } = useContext(UserContext);
   
    useEffect(() => {
        setLoading(true);
        axios.get("/erp/productions").then(({ data }) => {
            setProduction(data.reverse());
            setAction("");
            setLoading(false);
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
            <CustomTable name={"Production"} dataValue={production} columns={columns} setAction={setAction} metaKey={true}/>
        </>
    )
}

export default Productions