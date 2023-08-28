import React, { useContext, useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [action, setAction] = useState("");
    const { setLoading } = useContext(UserContext);
   
    useEffect(() => {
        setLoading(true);
        axios.get("/erp/purchases").then(({ data }) => {
            setPurchases(data.reverse());
            setAction("");
            setLoading(false);
        })
    }, [action])

    const columns = [
        { selectionMode: true, },
        { field: "reference", filter: "reference", header: "Code" },
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" },
        { body: "dateFormat", header: "Date" },
        { body: "dateThirdFormat", header: "Expected Arrival" },
        { field: "formatMoney",  filter: "total", header: "₱Total" },
        { body: "state", header: "State" },
    ]
    
    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Purchase"} dataValue={purchases} columns={columns} setAction={setAction} metaKey={true}/>
        </>
    )
}

export default Purchase;