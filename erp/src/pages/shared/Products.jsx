import React, { useContext, useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [action, setAction] = useState("");
    const { setLoading } = useContext(UserContext);
   
    useEffect(() => {
        setLoading(true);
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data.reverse());
            setAction("");
            setLoading(false);
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { body: "image", header: "" }, 
        { field: "name", filter: "name", header: "Product Name" }, 
        { field: "quantity", filter: "quantity", header: "On Hand" }, 
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
            <CustomTable name={"Product"} dataValue={products} columns={columns} setAction={setAction} metaKey={false}/>
        </>
    )
}

export default Products