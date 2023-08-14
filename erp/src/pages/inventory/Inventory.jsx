import React, { useEffect, useState } from 'react';
import axios from "axios";

const Inventory = () => {
    const [products, setProducts] = useState(0);
    const [materials, setMaterials] = useState(0);
    const [purchase, setPurchase] = useState({
        pending: 0,
        inProgress: 0,
        done: 0
    });
    const [production, setProduction] = useState({
        pending: 0,
        inProgress: 0,
        done: 0
    });

    useEffect(() => {
        axios.get("/erp/productions").then(({ data }) => {
            const pending = data.filter(item => item.state === 1);
            const inProgress = data.filter(item => item.state === 2);
            const done = data.filter(item => item.state === 3);
            setProduction({
                pending: pending.length,
                inProgress: inProgress.length,
                done: done.length
            });
        })
    }, [])

    useEffect(() => {
        axios.get("/erp/purchases").then(({ data }) => {
            const pending = data.filter(item => item.state === 1);
            const inProgress = data.filter(item => item.state === 2);
            const done = data.filter(item => item.state >= 3);
            setPurchase({
                pending: pending.length,
                inProgress: inProgress.length,
                done: done.length
            });
        })
    }, [])

    useEffect(() => {
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data.length);
        })
        axios.get("/erp/raw-materials").then(({ data }) => {
            setMaterials(data.length);
        })
    }, [])

    return (
        <div>
            <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                <span className="text-lg font-semibold">Inventory Overview</span>
            </div>
            {/* <div className='grid grid-cols-[200px_1fr] gap-5 pt-28 px-4'>    
                <div className='grid gap-5'>
                    <div className='flex flex-col gap-2 bg-white drop-shadow-md p-4 rounded-md'>
                        <span className='text-sm font-semibold'>Total of Products</span>
                        <div className="flex items-center gap-3 font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <span className='text-2xl'>
                                {products}
                            </span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 bg-white drop-shadow-md p-4 rounded-md'>
                        <span className='text-sm font-semibold'>Total of Raw Materials</span>
                        <div className="flex items-center gap-3 font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <span className='text-2xl'>
                                {materials}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='flex flex-col gap-6 bg-white drop-shadow-md p-4 rounded-md'>
                        <span className='text-xl font-semibold'>Productions</span>
                        <div className="flex flex-col gap-2 font-semibold">
                            <div className='bg-yellow-100 items-center py-1 px-3 rounded-lg flex justify-between w-full'>
                                <span className='text-yellow-700'>Pending</span>
                                <span className='text-yellow-700 text-2xl'>{production.pending}</span>
                            </div>
                            <div className='bg-blue-100 items-center py-1 px-3 rounded-lg flex justify-between w-full'>
                                <span className='text-blue-700'>In Progress</span>
                                <span className='text-blue-700 text-2xl'>{production.inProgress}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 bg-white drop-shadow-md p-4 rounded-md'>
                        <span className='text-xl font-semibold'>Purchases</span>
                        <div className="flex flex-col gap-2 font-semibold">
                            <div className='bg-yellow-100 items-center py-1 px-3 rounded-lg flex justify-between w-full'>
                                <span className='text-yellow-700'>Pending</span>
                                <span className='text-yellow-700 text-2xl'>{purchase.pending}</span>
                            </div>
                            <div className='bg-blue-100 items-center py-1 px-3 rounded-lg flex justify-between w-full'>
                                <span className='text-blue-700'>In Progress</span>
                                <span className='text-blue-700 text-2xl'>{purchase.inProgress}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Inventory;