import React, { useEffect, useState } from 'react';
import ReportTable from '../../components/ReportTable';
import axios from "axios";

const ProductionReport = () => {
    const [productions, setProductions] = useState([]);

    useEffect(() => {
        axios.get("/erp/productions").then(({ data }) => {
            setProductions(data);
        })
    }, [])

    const columns = [
        { selectionMode: true, },
        { field: "reference", filter: "reference", header: "Code" },
        { field: "product.name", filter: "product.name", header: "Product Name" }, 
        { field: "quantity", filter: "quantity", header: "Produced Quantity" },
        { body: "dateFormat", header: "Date" }
    ]

    return (
        <ReportTable name={"Production"} columns={columns} dataValue={productions} />
    )
}

export default ProductionReport;