import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import axios from 'axios';

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [action, setAction] = useState([]);

    useEffect(() => {
        axios.get("/erp/shipments").then(({ data }) => {
            setShipments(data.reverse());
            setAction("");
        })
    }, [action]);

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { body: "dateFourthFormat", header: "Scheduled Date" }, 
        { body: "dateSecondFormat", header: "Expected Arrival" }, 
        { body: "orderState", header: "" }, 
    ]

    return (
        <CustomTable name={"Shipment"} dataValue={shipments} columns={columns} setAction={setAction}/>
    )
}

export default Shipments;