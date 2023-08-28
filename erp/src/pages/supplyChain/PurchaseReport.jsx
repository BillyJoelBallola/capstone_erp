import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportTable from '../../components/ReportTable';

const PurchaseReport = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get("/erp/purchases").then(({ data }) => {
            setPurchases(data);
        })
    }, [])

    const columns = [
        { selectionMode: true, },
        { field: "reference", filter: "reference", header: "Code" },
        { field: "supplier.business", filter: "supplier.business", header: "Supplier" },
        { body: "dateFormat", header: "Date" },
        { field: "total",  filter: "total", header: "Total" }
    ]

    return (
        <ReportTable name={"Purchase"} dataValue={purchases} columns={columns} />
    )
}

export default PurchaseReport;