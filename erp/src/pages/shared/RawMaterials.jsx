import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';

const RawMaterials = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        axios.get("/erp/raw-materials").then(({ data }) => {
            setRawMaterials(data.reverse());
            setAction("");
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "name", filter: "name", header: "Item Name" }, 
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" }, 
        { field: "quantity", filter: "quantity", header: "Quantity On Hand" }, 
        { body: "quantityStatus", header: "" }, 
    ]

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Raw Material"} dataValue={rawMaterials} columns={columns} setAction={setAction}/>
        </>
    )
}

export default RawMaterials