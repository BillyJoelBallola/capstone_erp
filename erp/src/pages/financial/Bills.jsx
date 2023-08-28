import React, { useContext, useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const Bills = () => {   
    const [bills, setBills] = useState([]);
    const [action, setAction] = useState("");
    const { setLoading } = useContext(UserContext);

    useEffect(() => {   
        setLoading(true);
        axios.get("/erp/bills").then(({ data }) => {
            setBills(data.reverse());
            setLoading(false);
            setAction("");
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" }, 
        { body: "dateFormat", header: "Bill Date"},
        { body: "dateThirdFormat", header: "Due Date"},
        { field: "formatMoney", filter: "total", header: "₱Total" }, 
        { body: "paymentStatus", header: "Payment" }, 
        { body: "state", header: "State" }, 
    ]

    return (
        <CustomTable name={"Bill"} columns={columns} dataValue={bills} setAction={setAction} metaKey={true}/>
    )
}

export default Bills;