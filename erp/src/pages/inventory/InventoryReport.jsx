import React, { useContext, useEffect, useState } from 'react';
import ReportTable from '../../components/ReportTable';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InventoryReport = () => {
    const op = useParams().op;
    const [products, setProducts] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/production_planning").then(({ data }) => {
            setProducts(data);
            setLoading(false);
        })
        axios.get("/erp/purchase_planning").then(({ data }) => {
            setRawMaterials(data);
            setLoading(false);
        })
    }, [])

    const productsColumn = [
        { selectionMode: true, },
        { field: "name", filter: "name", header: "Product" }, 
        { field: "price", filter: "price", header: "₱Unit Price" }, 
        { field: "quantity", filter: "quantity", header: "On Hand" }, 
        { field: "forecast.inComing", filter: "forecast.inComing", header: "Incoming" },
        { field: "forecast.outGoing", filter: "forecast.outGoing", header: "Outgoing" },
    ]
    
    const materialsColumn = [
        { selectionMode: true, },
        { field: "name", filter: "name", header: "Material" }, 
        { field: "price", filter: "price", header: "₱Unit Price" }, 
        { field: "quantity", filter: "quantity", header: "On Hand" }, 
        { field: "forecast.inComing", filter: "forecast.inComing", header: "Incoming" }
    ]

    return (
        <ReportTable name={"Inventory"} columns={op === "products" ? productsColumn : materialsColumn} dataValue={op === "products" ? products : rawMaterials} />
    )
}

export default InventoryReport;