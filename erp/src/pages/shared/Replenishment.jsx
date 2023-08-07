import React, { useContext, useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable'
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

const Replenishment = () => {
    const [automateProcess, setAutomateProcess] = useState([]);
    const [action, setAction] = useState("");
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/productions").then(({ data }) => {
            const productionData = data.filter(item => item.automate === true);
            return productionData;
        }).then((productionData) => {
            axios.get("/erp/purchases").then(({ data }) => {
                const purchasesData = data.filter(item => item.automate === true);
                setAutomateProcess([...productionData, ...purchasesData]);
                setAction("");
                setLoading(false);
            })
        })
    }, [action])

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