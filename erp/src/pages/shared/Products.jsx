import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [action, setAction] = useState("");
   
    useEffect(() => {
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data.reverse());
            setAction("")
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { body: "image", header: "" }, 
        { field: "name", filter: "name", header: "Product Name" }, 
        { field: "quantity", filter: "quantity", header: "Quantity On Hand" }, 
        { field: "price", filter: "price", header: "Sales Price"  },
        { body: "isActive", header: "Status" }, 
        { body: "quantityStatus", header: "" }, 
    ]

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Product"} dataValue={products} columns={columns} setAction={setAction} />
        </>
    )
}

export default Products