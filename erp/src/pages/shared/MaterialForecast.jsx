import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ForecastGraph from '../../components/ForecastGraph';

// TODO: graph

const MaterialForecast = () => {
    const id = useParams().id;
    const op = useParams().op;
    const [material, setMaterial] = useState({});
    const [purchaseOrder, setPurchaseOrder] = useState([]);
    const [purchasesMats, setPurchasesMats] = useState([]);
    const [unitTotal, setUnitTotal] = useState(0);
    const location = op === "inventory" ? "inventory" : "supply-chain";

    useEffect(() => {
        if(id){
            axios.get(`/erp/raw-material/${id}`).then(({ data }) => {
                setMaterial(data);
            })
        }
    }, [id])

    useEffect(() => {
        if(purchaseOrder.length === 0){
            axios.get("/erp/purchases").then(({ data }) => {
                const targetMaterial = data.find(item => {
                    if(item.state === 2){
                        return item.materials.some(material => material.id === id);
                    }
                });
                const rawMaterials = targetMaterial?.materials?.map(raw => (raw));
                const mat = rawMaterials?.filter(raw => (raw.id === id));
                setPurchasesMats(mat);
                setPurchaseOrder([targetMaterial]);
            })
        }
    }, [purchasesMats, purchaseOrder])

    useEffect(() => {
        if(purchasesMats){
            setUnitTotal(purchasesMats && purchasesMats.length > 0 ? purchasesMats[0].qty : 0);
        }
    }, [purchasesMats])

    return (
        <div>
            <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                <div>
                    <span className="text-lg font-semibold">Material / </span>
                    <NavLink 
                        to={`/${location}/raw-materials/raw-material-form/${id}`}
                        className="text-lg font-semibold text-blue-400"
                    >
                        {material && material.name}
                    </NavLink>
                </div>
            </div>
            <div className="px-6 py-8 pt-28">
                <div className='flex gap-4 max-w-min whitespace-nowrap py-2 px-4 border border-gray-300 mb-4 bg-white'>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{material && material.quantity}</span>
                        <span>On Hand</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>+</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{unitTotal}</span>
                        <span>Incoming</span>
                    </div>
                    {/* <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>-</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{0}</span>
                        <span>Outgoing</span>
                    </div> */}
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>=</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{material && material.quantity + Number(unitTotal)} Units</span>
                        <span>Forecasted</span>
                    </div>
                </div>
                {/* <ForecastGraph id={id} /> */}
                <div className='bg-white border border-gray-300'>
                    <div className='grid grid-cols-3 p-3 border-0 border-b border-gray-300 font-semibold'>
                        <span>Replenishment</span>
                        <span>Date</span>
                        <span>Units</span>
                    </div>
                    {
                        purchasesMats?.length > 0 &&
                        purchaseOrder?.length > 0 ?
                        <div className='grid grid-cols-3 p-3 border-0 border-b border-gray-300' key={purchasesMats[0]?.id}>
                            <NavLink to={`/${location}/purchases/purchase-form/${purchaseOrder[0]?._id}`} className="text-blue-400">{purchaseOrder[0]?.reference}</NavLink>
                            <span>{moment(purchaseOrder[0]?.date).format("LL")}</span>
                            <span>{purchasesMats[0]?.qty}</span>
                        </div>
                        :
                        <div className='grid p-3 border-0 border-b border-gray-300'>
                            <span>No purchase order for this material.</span>
                        </div>
                    }
                     <div className='grid grid-cols-3 p-3 border-0 border-b border-gray-30 font-semibold'>
                        <div className='col-start-1 col-span-2'>Forecasted</div>
                        <span>{unitTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaterialForecast;