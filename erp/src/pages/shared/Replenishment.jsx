import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable'
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const Replenishment = () => {
    const [automateProcess, setAutomateProcess] = useState([]);
    const [production, setProduction] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        axios.get("/erp/productions").then(({ data }) => {
            const productionData = data.filter(item => ( item.automate === true  ));
            setProduction(productionData.reverse());
            setAction("");
        })
        axios.get("/erp/purchases").then(({ data }) => {
            const purchasesData = data.filter(item => ( item.automate === true ));
            setPurchase(purchasesData.reverse());
            setAction("");
        })
        
    }, [action])

    useEffect(() => {
        setAutomateProcess([...production, ...purchase]);
    }, [production, purchase])

    const columns = [
        { body: "source", filter: "reference", header: "Source" }, 
        { body: "replenishActions", header: "" }, 
    ]

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Replenishment"} columns={columns} dataValue={automateProcess} setAction={setAction}/>
        </>
    )
}

export default Replenishment