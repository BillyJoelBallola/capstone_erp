import React, { useEffect, useState } from 'react';
import Planning from '../../components/Planning';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const SupplyChain = () => {
    const [shipment, setShipment] = useState(0);
    const [production, setProduction] = useState(0);
    const [purchase, setPurchase] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const [shipmentResponse, productionResponse, purchaseResponse] = await Promise.all([
                axios.get("/erp/shipments"),
                axios.get("/erp/productions"),
                axios.get("/erp/purchases")
            ]);

            setShipment(shipmentResponse.data.filter(data => data.state === 1));
            setProduction(productionResponse.data.filter(data => data.state <= 2));
            setPurchase(purchaseResponse.data.filter(data => data.state <= 2));
        }

        fetchData();
    }, [])

    return (
        <div>
            <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                <span className="text-lg font-semibold">Supply Chain Overview</span>
            </div>
            <div className='pt-28 pb-10 px-6'>
                <div className='grid grid-cols-3 gap-4 mb-6'>
                    <div className='grid gap-4 bg-white border border-gray-300 p-4 border-r-yellow-400 border-r-4'>
                        <span className='text-lg font-semibold'>Shipments</span>
                        <NavLink to="/supply-chain/shipments" className="btn-dark-gray max-w-min whitespace-nowrap px-4">{shipment?.length} to Process</NavLink>
                    </div>
                    <div className='grid gap-4 bg-white border border-gray-300 p-4 border-r-blue-400 border-r-4'>
                        <span className='text-lg font-semibold'>Productions</span>
                        <NavLink to="/supply-chain/productions" className="btn-dark-gray max-w-min whitespace-nowrap px-4">{production?.length} to Process</NavLink>
                    </div>
                    <div className='grid gap-4 bg-white border border-gray-300 p-4 border-r-green-400 border-r-4'>
                        <span className='text-lg font-semibold'>Purchases</span>
                        <NavLink to="/supply-chain/purchases" className="btn-dark-gray max-w-min whitespace-nowrap px-4">{purchase?.length} to Process</NavLink>
                    </div>
                </div>
                <Planning />
            </div>
        </div>
    )
}

export default SupplyChain