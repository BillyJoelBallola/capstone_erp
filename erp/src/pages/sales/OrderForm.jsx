import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";

// TODO: Invoice

const OrderForm = () => {
    const id = useParams().id;
    const [action, setAction] = useState("");
    const [order, setOrder] = useState({});

    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    useEffect(() => {
        if(id || action){
            axios.get(`/erp/order/${id}`).then(({ data }) => {
                setOrder(data);
                setAction("");
            })
        }
    }, [id, action])
    
    const confirmOrder = async () => {
        const response = await axios.put("/erp/change_order_state", { id: id, invoice: 2, state: order.state , shipment: order.shipment });
        if(response.statusText === "OK"){
            axios.post("/erp/add_shipment", { orderId: id, reference: referenceGenerator("SHP") });
            setAction("confirm");
            return toast.success( "Sales order has been confirm and ready for invoicing", { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Failed to confirm sales order.", { position: toast.POSITION.TOP_RIGHT });
        }
    }
    
    const StateStyle = () => {
        return (
            <div className="flex justify-end">
                <div className="max-w-min p-2 font-semibold text-sm flex items-center justify-center gap-3 relative">
                    <div className="w-4/5 h-[2px] bg-gray-300 absolute"/>
                    <div className={`${order.invoice === 1 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Pending</div>
                    <div className={`${order.invoice === 2 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10 whitespace-nowrap`}>To Invoice</div>
                    <div className={`${order.invoice === 3 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Done</div>
                    {
                        order.state === 5 &&
                        <div className={`${order.state === 5 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Cancelled</div>
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer draggable={false} hideProgressBar={true} />
            <div>
                <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">
                                Sales Order
                            </span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span className="">
                                    {order.reference}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {
                                order.invoice === 1 &&
                                <button onClick={confirmOrder} className='btn-dark-gray'>Confirm</button>
                            }
                            {
                                order.invoice === 2 &&
                                <button className='btn-primary p-2'>Create Invoice</button>
                            }
                        </div>
                        { id && <StateStyle /> }
                    </div>
                    <div className="p-4 border grid gap-4 bg-white" id='order-form'>
                        <div className="grid gap-10 grid-cols-2">
                            <div className='grid'>
                                <span className='text-sm'>Customer</span>
                                <span className='text-xl font-semibold'>{order?.customer?.name}</span>
                            </div>
                            <div className='grid'>
                                <span className='text-sm'>Order Date</span>
                                <span className='font-semibold'>{moment(order.date).format("LL")}</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl my-4">Orders</div>
                            <div className='mb-4 grid grid-cols-[1fr_100px_100px] items-center gap-10 px-3'>
                                <span className='font-semibold text-gray-600'>Product</span>    
                                <span className='font-semibold text-gray-600'>Price</span>        
                                <span className='font-semibold text-gray-600'># Qty</span>        
                            </div>
                            <div>
                                {
                                    order?.orders?.map(ord => (
                                        <div className='bg-gray-100 border-x-0 border border-y-gray-300' key={ord.productId}>
                                            <div className="py-4 px-3 grid grid-cols-[1fr_100px_100px] items-center gap-10">
                                                <span className='font-semibold'>{ord.productName}</span>
                                                <span className='font-semibold'>{ord.totalPrice}</span>
                                                <span className='font-semibold'>{ord.quantity}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                                
                                <div className="flex justify-end py-6">
                                    <div className="flex gap-2 text-lg py-2 px-3 pr-64 font-semibold border-0 border-t-[1px] border-t-gray-300">
                                        <span>Total:</span>
                                        <span>₱{order.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderForm;