import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomTable from "../../components/CustomTable";

const JournalEntries = () => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [action, setAction] = useState([]);

    useEffect(() => {
        axios.get("/erp/payments").then(({ data }) => {
            const combinedData = data.reverse();
            axios.get("/erp/bills").then(({ data }) => {
                combinedData.push(...data.reverse());
                setJournalEntries(combinedData);
            })
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "journal", filter: "journal", header: "Journal" }, 
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" }, 
        { body: "dateFormat", header: "Date"},
        { body: "amountAndTotal", filter: "amount", header: "₱Amount" },
    ]

    return (
        <CustomTable name={"Journal Entrie"} dataValue={journalEntries.sort((a, b) => new Date(b.date) - new Date(a.date))} setAction={setAction} columns={columns} />
    )
}

export default JournalEntries