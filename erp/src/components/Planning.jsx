import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import placeHolder from "../assets/placeholder.png";
import axios from "axios";

// TODO: function for production and purchase

const Planning = () => {
    const path = useLocation().pathname;
    const { setLoading } = useContext(UserContext);
    const [productionPlanning, setProductionPlanning] = useState([]); 
    const [unsufficientMaterials, setUnsufficientMaterials] = useState([]);
    const [supplierTimeRate, setSupplierTimeRate] = useState([]); 
    
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const [production, materials, supplier] = await Promise.all([
                axios.get("/erp/production_planning"),
                axios.get("/erp/raw-materials"),
                axios.get("/erp/supplier_time-rate")
            ]);
            const productionData = production.data.filter(planning => planning.totalDemand !== 0);
            setProductionPlanning(productionData.filter(product => (Number(product.quantity) + Number(product.forecast.inComing) - Number(product.forecast.outGoing)) < product.totalDemand));
            setUnsufficientMaterials(materials.data.filter(materials => materials.quantity <= 10));
            setSupplierTimeRate(supplier.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    const RawMaterials = () => {
        const suppliers = supplierTimeRate.map(supplier => {   
            const rawMaterials = unsufficientMaterials.filter(materials => supplier.supplierId.toString() === materials.supplier._id.toString());

            return {
                ...supplier,
                rawMaterials: rawMaterials
            }
        });

        return (
            <div className="flex flex-col rounded-lg bg-white drop-shadow-sm h-min border">
                <div className='border-x-0 border-t-0 border px-4 py-2 grid'>
                    <span className='text-lg font-semibold'>
                        Raw Materials 
                        {/* <span className='text-xs text-red-600 bg-red-200 px-2 rounded-lg'>Reorder</span> */}
                    </span>
                    <span className='text-sm text-gray-400'>Raw materials need replenishment based on products that has customers demand with low quantity.</span>
                </div>
                <div className='max-h-[500px] overflow-y-auto'>
                    {
                        suppliers?.filter(item => item.rawMaterials.length !== 0).length !== 0 ?
                        suppliers?.filter(item => item.rawMaterials.length !== 0).map((supplier, idx) => (
                            <div key={idx} className='flex flex-col m-2 bg-gray-200 rounded-lg p-4'> 
                                <div className='flex justify-between items-center'>
                                    <div className='flex flex-col mb-3'>
                                        <span className='text-lg font-semibold'>{supplier.supplier}</span>
                                        <div className='flex gap-1 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                            </svg>
                                            On-time Rate: {supplier.rate}%
                                        </div>
                                    </div>
                                    <button className='self-baseline bg-white rounded-md font-semibold py-1 hover:bg-white/50 duration-150 px-4'>Purchase</button>
                                </div>
                                <div className='flex flex-col gap-2'>   
                                    { 
                                        supplier.rawMaterials.map(rawMat => (
                                            <div className='px-2 flex justify-between py-1 bg-white rounded-md' key={rawMat._id}>
                                                <span>{rawMat.name}</span>
                                                <span>
                                                    {/* ₱{rawMat.price}/ */}
                                                    {rawMat.measurement}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )) :
                        <div className='p-4'>
                            <span>No items found.</span>
                        </div>
                    }
                </div>
            </div> 
        )
    }

    const Products = () => {
        return (
            <div className="flex flex-col rounded-lg bg-white drop-shadow-sm h-min border">
                <div className='border-x-0 border-t-0 border px-4 py-2 grid'>
                    <span className='text-lg font-semibold'>
                        Products
                        {/* <span className='text-xs text-red-600 bg-red-200 px-2 rounded-lg'>Reorder</span> */}
                    </span>
                    <span className='text-sm text-gray-400'>Products need replenishment based on customers total demand and forecasted quantity.</span>
                </div>  
                <div className='max-h-[500px] overflow-y-auto grid gap-2'>
                    {   
                        productionPlanning.length !== 0 ?
                        productionPlanning?.map(planning => (
                            <div key={planning._id} className='flex flex-col md:flex-row md:gap-4 gap-2 p-4'>
                                <div className="w-36 grid place-items-center">
                                    <img className="object-contain rounded-md drop-shadow-lg" src={planning.productImg === "" ? placeHolder : `http://localhost:4000/uploads${planning.productImg}`} alt="product-image" />
                                </div>
                                <div className='flex flex-col gap-2 justify-between w-full'>
                                    <div className='flex flex-col justify-center'>
                                        <NavLink to={`${path}/products/product-form/${planning._id}`} className='text-xl font-semibold text-black hover:underline'>{planning.name}</NavLink>
                                        <div className='flex flex-col md:gap-3 md:flex-row flex-wrap'>
                                            <NavLink to={`${path}/product_forecast/${planning._id}`} className='flex gap-1 items-center hover:underline'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#676F7B" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                                </svg>
                                                <span className='text-gray-600'>Forecasted: {Number(planning.quantity) + Number(planning.forecast.inComing) - Number(planning.forecast.outGoing)} Units</span>
                                            </NavLink>
                                            <div className='flex gap-1 items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#676F7B" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className='text-gray-600'>Demand: {planning.totalDemand} Units</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className='btn-dark px-3 self-baseline'>
                                        Produce {Number((Number(planning.quantity) + Number(planning.forecast.inComing) - Number(planning.forecast.outGoing)).toString().split("-").join(""))} Units
                                    </button>
                                </div>
                            </div>
                        )) : 
                        <div className='p-4'>
                            <span>No items found.</span>
                        </div>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='grid pb-10 gap-4 md:grid-cols-2'>
                <Products />
                <RawMaterials />
            </div>
        </div>
    )
}

export default Planning;