import React, { useEffect, useState } from 'react';
import ForecastGraph from '../../components/ForecastGraph';
import { NavLink, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

const ProductForecast = () => {
    const id = useParams().id;
    const op = useParams().op;
    const [product, setProduct] = useState({});
    const [forecasts, setForecasts] = useState([]);
    const [total, setTotal] = useState({
        inComing: 0,
        outGoing: 0,
        totalUnit: 0
    });
    const location = op === "inventory" ? "inventory" : "supply-chain";

    useEffect(() => {
        if(id){
            axios.get(`/erp/product/${id}`).then(({ data }) => {
                setProduct(data);
            })
        }
    }, [id])

    useEffect(() => {
        axios.get("/erp/productions")
            .then(({ data }) => {
                const incomingProduct = data.filter(item => (item.product._id === id && item.state === 2));
                return incomingProduct;
            })
            .then((incomingProduct) => {
                axios.get("/erp/shipments").then(({ data }) => {
                    let outGoing = [];
                    data.map(shipment => {
                        if(shipment.state >= 2 && (shipment.order.state === 2 || shipment.order.state === 3)){
                            shipment?.order?.orders?.filter(prod => {
                                if(prod.productId === id){
                                    return outGoing.push(shipment)
                                }
                            })
                        }
                    });
                    setForecasts([...incomingProduct, ...outGoing]);    
                })
            })
    }, [])

    useEffect(() => {
        if(forecasts.length !== 0){
            let inComing = 0;
            let outGoing = 0;
            forecasts.map(item => {
                if(item.reference.includes("PRD")){
                    inComing = item.quantity;
                }
                if(item.reference.includes("SHP")){
                    item.order.orders.map(order => {
                        if(order.productId === id){
                            return outGoing += order.quantity;
                        }
                    })
                }
            })
            setTotal(prev => ({...prev, inComing: inComing, outGoing: outGoing}));
        }
    }, [forecasts]);
    
    return (
        <div>
            <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                <div>
                    <span className="text-lg font-semibold">Product / </span>
                    <NavLink 
                        to={`/${location}/products/product-form/${id}`}
                        className="text-lg font-semibold text-blue-400"
                    >
                        {product && product.name}
                    </NavLink>
                </div>
            </div>
            <div className="px-6 py-8 pt-28">
                <div className='flex gap-4 py-2 px-4 border border-gray-300 mb-4 bg-white max-w-min whitespace-nowrap'>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{product && product.quantity}</span>
                        <span>On Hand</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>+</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{total.inComing}</span>
                        <span>Incoming</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>-</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{total.outGoing}</span>
                        <span>Outgoing</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>=</span>
                    </div>
                    <div className='grid gap-1 text-center'>
                        <span className='text-2xl font-semibold'>{product && product.quantity + total.inComing - total.outGoing} Units</span>
                        <span>Forecasted</span>
                    </div>
                </div>
                <ForecastGraph id={id} />
                <div className='bg-white border border-gray-300'>
                    <div className='grid grid-cols-4 p-3 border-0 border-b border-gray-300 font-semibold'>
                        <span>Replenishment</span>
                        <span>Shipment</span>
                        <span>Date</span>
                        <span>Units</span>
                    </div>
                    {
                        forecasts.length > 0 ?
                        forecasts.map(item => (
                            <div className='grid grid-cols-4 p-3 border-0 border-b border-gray-300' key={item._id}>
                                {
                                    item?.reference?.includes("PRD") ?
                                    <NavLink to={`/${location}/productions/production-form/${item._id}`} className="text-blue-400">{item.reference}</NavLink>
                                    : <span>--</span>
                                }
                                {
                                    item?.reference?.includes("SHP") ?
                                    <NavLink to={`/${location}/shipments/shipment-form/${item._id}`} className="text-blue-400">{item.reference}</NavLink>
                                    : <span>--</span>
                                }
                                {
                                    item?.reference?.includes("PRD") ?
                                    <>
                                        <span>{moment(item.date).format("LL")}</span>
                                        <span>{item.quantity}</span>
                                    </>
                                    :
                                    item?.reference?.includes("SHP") ?
                                    <>
                                        <span>{moment(item.scheduledDate).format("LL")}</span>
                                        <span>{item?.order?.orders?.map(item => item.productId === id && item.quantity )}</span>
                                    </>
                                    :
                                    <></>
                                } 
                            </div>
                        ))
                        :
                        <div className='grid p-3 border-0 border-b border-gray-300'>
                            <span>No production order for this product.</span>
                        </div>
                    }
                     <div className='grid grid-cols-4 p-3 border-0 border-b border-gray-30 font-semibold'>
                        <div className='col-start-1 col-span-3'>Forecasted</div>
                        <span>{total.inComing + total.outGoing}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductForecast