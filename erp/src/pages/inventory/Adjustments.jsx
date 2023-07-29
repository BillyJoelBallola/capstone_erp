import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable'
import axios from 'axios';

const Adjustments = () => {
    const [adjustments, setAdjustments] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        axios.get("/erp/adjustments").then(({ data }) => {
            setAdjustments(data.reverse());
            setAction("");
        })
    }, [action]);

    const columns = [
        { body: "dateFormat", header: "Date" }, 
        { field: "item.name", filter: "item.name", header: "Item Name" }, 
        { field: "oldQuantity", filter: "oldQuantity", header: "Old Qty" },
        { field: "newQuantity", filter: "newQuantity", header: "New Qty" },
        { field: "remarks", filter: "remarks", header: "Remarks" },
        { field: "user", filter: "user", header: "User" }
    ]

    return (
        <CustomTable columns={columns} dataValue={adjustments} name={"Adjustment"} setAction={setAction}/> 
    )
}

export default Adjustments