import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import ReportTable from '../../components/ReportTable';
import axios from "axios";

const AdjustmentReport = () => {
    const [adjustments, setAdjustments] = useState([]);
    const { setLoading } = useContext(UserContext); 

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/adjustments").then(({ data }) => {
            setAdjustments(data);
            setLoading(false);
        })
    }, [])

    const columns = [
        { body: "dateFormat", header: "Date" }, 
        { field: "item.name", filter: "item.name", header: "Item Name" }, 
        { field: "oldQuantity", filter: "oldQuantity", header: "Old Qty" },
        { field: "newQuantity", filter: "newQuantity", header: "New Qty" },
        { field: "remarks", filter: "remarks", header: "Remarks" },
        { field: "user", filter: "user", header: "User" }
    ]

    return (
        <ReportTable name={"Adjustment"} dataValue={adjustments} columns={columns} />
    )
}

export default AdjustmentReport;