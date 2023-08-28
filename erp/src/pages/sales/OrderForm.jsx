import React, { useEffect, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { formatMoney } from '../../static/_functions';
import moment from "moment";
import axios from 'axios';

const OrderForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const [action, setAction] = useState("");
    const [shipment, setShipment] = useState({});
    const [order, setOrder] = useState({});
    const [invoice, setInvoice] = useState({});

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

    useEffect(() => {   
        axios.get("/erp/shipments").then(({ data }) => {
            const shipmentData = data.find(item => item.order._id === id);
            setShipment(shipmentData);  
        })
        axios.get("/erp/invoices").then(({ data }) => {
            const invoiceData = data.find(item => item.order._id === id);
            setInvoice(invoiceData);  
        })
    }, [shipment, invoice])
    
    const confirmOrder = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to confirm this order?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                const response = await axios.put("/erp/change_order_state", { id: id, invoice: 2, state: 2 , shipment: order.shipment });
                if(response.statusText === "OK"){
                    // Undecided Function: after order confirmation the sales person will added.
                    axios.post("/erp/add_shipment", { orderId: id, reference: referenceGenerator("SHP") });
                    setAction("confirm");
                    return toast.success( "Sales order has been confirm and ready for invoicing", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to confirm sales order.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        })
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
            <ConfirmPopup />
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
                               { order.invoice === 3 && <NavLink className="text-green-500 italic" to={`/sales/invoices/invoice-form/${id}/${invoice._id}`}>View Invoice</NavLink> }
                            </div>
                        </div>
                    </div>
                    {
                        shipment &&
                        <div className='grid place-items-center'>
                            <div className='flex border border-gray-400 py-[1px] rounded-md text-xs'>
                                <NavLink to={`/sales/shipments/shipment-form/${shipment._id}`} className="flex gap-1 items-center px-2 rounded-s-md hover:bg-gray-200">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                        </svg>
                                    </div>
                                    <div className='grid text-left'>
                                        <span>Shipment</span>
                                    </div>
                                </NavLink>
                            </div>  
                        </div>
                    }
            </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {
                                (order.invoice === 1 && op === "sales") &&
                                <button onClick={confirmOrder} className='btn-dark-gray'>Confirm</button>
                            }
                            {
                                (order.invoice === 2 && op === "sales") &&
                                <button className='btn-primary p-2' onClick={() => navigate(`/sales/invoices/invoice-form/${id}`)}>Create Invoice</button>
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
                                                <span className='font-semibold'>{formatMoney(ord.totalPrice)}</span>
                                                <span className='font-semibold'>{ord.quantity}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                                
                                <div className="flex justify-end py-6">
                                    <div className="flex gap-2 text-lg py-2 px-3 pr-64 font-semibold border-0 border-t-[1px] border-t-gray-300">
                                        <span>Total:</span>
                                        <span>{formatMoney(order.total)}</span>
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