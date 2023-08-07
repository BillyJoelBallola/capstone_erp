import React, { useContext, useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [action, setAction] = useState([]);
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/shipments").then(({ data }) => {
            setShipments(data.reverse());
            setAction("");
            setLoading(false);
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