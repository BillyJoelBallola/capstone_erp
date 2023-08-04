import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomTable from "../../components/CustomTable";

const JournalEntries = () => {
    const [journalEntries, setJournalEntries] = useState([]);
    const [action, setAction] = useState([]);

    const fetchJournalEntries = async () => {
        const [payments, invoices, bills] = await Promise.all([
            axios.get("/erp/payments"),
            axios.get("/erp/invoices"),
            axios.get("/erp/bills"),
        ]);

        setJournalEntries([...payments.data.reverse(), ...invoices.data.reverse(), ...bills.data.reverse()]);
    }

    useEffect(() => {
        fetchJournalEntries();
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "reference", filter: "reference", header: "Code" }, 
        { field: "journal", filter: "journal", header: "Journal" }, 
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" }, 
        { field: "customer.business", filter: "customer.business", header: "Customer" }, 
        { body: "dateFormat", header: "Date"},
        { body: "amountAndTotal", filter: "amount", header: "₱Amount" },
    ]

    return (
        <CustomTable name={"Journal Entrie"} dataValue={journalEntries.sort((a, b) => new Date(b.date) - new Date(a.date))} setAction={setAction} columns={columns} />
    )
}

export default JournalEntries