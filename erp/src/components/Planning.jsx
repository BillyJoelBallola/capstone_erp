import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import placeHolder from "../assets/placeholder.png";
import axios from "axios";

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
            <div className="flex flex-col rounded-lg bg-white drop-shadow-sm h-min">
                <div className='border-x-0 border-t-0 border px-4 py-2'>
                    <span className='text-lg font-semibold'>Raw Materials <span className='text-xs text-red-600 bg-red-200 px-2 rounded-lg'>Reorder</span></span>
                </div>
                <div className='max-h-[500px] overflow-y-auto'>
                    {
                        suppliers?.filter(item => item.rawMaterials.length !== 0).map((supplier, idx) => (
                            <div key={idx} className='flex flex-col m-2 bg-gray-200 rounded-lg p-4'> 
                                <div className='flex justify-between items-center'>
                                    <div className='flex flex-col mb-3'>
                                        <span className='text-lg font-semibold'>{supplier.supplier}</span>
                                        <span>On-time Rate: {supplier.rate}%</span>
                                    </div>
                                    <button className='self-baseline bg-white rounded-md font-semibold py-1 hover:bg-white/50 duration-150 px-4'>Purchase</button>
                                </div>
                                <div className='flex flex-col gap-2'>   
                                    { 
                                        supplier.rawMaterials.map(rawMat => (
                                            <div className='px-2 flex justify-between py-1 bg-gray-100 rounded-md' key={rawMat._id}>
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
                        ))
                    }
                </div>
            </div> 
        )
    }

    const Products = () => {
        return (
            <div className="flex flex-col rounded-lg bg-white drop-shadow-sm h-min">
                <div className='border-x-0 border-t-0 border px-4 py-2'>
                    <span className='text-lg font-semibold'>Products <span className='text-xs text-red-600 bg-red-200 px-2 rounded-lg'>Reorder</span></span>
                </div>  
                <div className='max-h-[500px] overflow-y-auto grid gap-2'>
                    {
                        productionPlanning?.map(planning => (
                            <div key={planning._id} className='flex gap-4 p-4'>
                                <div className='flex gap-4'>
                                    <div className="w-28 aspect-square grid place-items-center">
                                        <img className="object-contain rounded-md drop-shadow-lg" src={planning.productImg === "" ? placeHolder : `http://localhost:4000/uploads${planning.productImg}`} alt="product-image" />
                                    </div>
                                </div>
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col justify-center'>
                                        <NavLink to={`${path}/products/product-form/${planning._id}`} className='text-xl font-semibold text-black hover:underline'>{planning.name}</NavLink>
                                        <NavLink to={`${path}/product_forecast/${planning._id}`} className='flex gap-1 items-center hover:underline'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#676F7B" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                            </svg>
                                            <span className='text-gray-600'>Forecasted: {Number(planning.quantity) + Number(planning.forecast.inComing) - Number(planning.forecast.outGoing)} Unit/s</span>
                                        </NavLink>
                                        <div className='flex gap-1 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#676F7B" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className='text-gray-600'>Demand (Orders): {planning.totalDemand} Unit/s</span>
                                        </div>
                                    </div>
                                    <button className='btn-dark px-3 self-baseline'>Produce {planning.totalDemand - (Number(planning.quantity) + Number(planning.forecast.inComing) - Number(planning.forecast.outGoing))} Unit/s</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='grid gap-4 md:grid-cols-2'>
                <Products />
                <RawMaterials />
            </div>
        </div>
    )
}

export default Planning;