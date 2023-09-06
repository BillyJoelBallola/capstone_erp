import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { country } from "../../static/country";
import axios from 'axios';

const CustomerForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const [salesNumber, setSalesNumber] = useState(0);
    const [customer, setCustomer] = useState({});
    const [action, setAction] = useState('');
    const [state, setState] = useState(0);

    useEffect(() => {
        if(id || action){
            axios.get(`/erp/customer/${id}`).then(({ data }) => {
                setCustomer(data);
                setState(data.state);
                setAction("");
            })
        }
    }, [id, action])

    useEffect(() => {
        axios.get("/erp/orders").then(({ data }) => {
            setSalesNumber(data.filter(order => order?.customer?._id === id).length);
        })
    }, [])

    
    const StateStyle = () => {
        return (
            <div className="flex justify-end">
                <div className="max-w-min p-2 font-semibold text-sm flex items-center justify-center gap-3 relative">
                    {state === 1 && <div className="text-red-400 border-red-400 bg-gray-200 border px-2 rounded-full z-10">Request</div>}
                    {state === 2 && <div className="text-green-400 border-green-400 bg-gray-200 border px-2 rounded-full z-10">Confirm</div>}
                </div>
            </div>
        )
    }

    const confirmCustomer = (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Do you want to confirm this customer?',
            acceptClassName: 'p-button-info',
            accept: async () => {
                const response = await axios.put("/erp/change_customer_state", { id: id, state: 2 });
                if(response.statusText === "OK"){
                    setAction("confirm");
                    return toast.success("Customer account confirmed.", { position: toast.POSITION.TOP_RIGHT });
                }else{

                }
            }
        });
    }

    return (
        <>
            <ToastContainer draggable={false} hideProgressBar={true} />
            <ConfirmPopup />
            <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                <div className='flex items-center gap-3'>       
                    <div className='flex gap-2'>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">Customer</span>
                        </div>
                    </div>
                </div>
                {
                    id && 
                    <div className='flex border border-gray-400 py-[1px] rounded-md text-xs'>
                        <div className='h-7 bg-gray-400 w-[1px]'/>
                        <button className='flex gap-1 items-center px-2 rounded-e-md hover:bg-gray-200'>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>
                            </div>
                            <div className='grid text-left'>
                                <span>Sales</span>
                                <span className='-mt-1'>{salesNumber} Orders</span>
                            </div>
                        </button>
                    </div>
                }
            </div>
            <div className="px-6 py-8 pt-28 bg-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {state === 1 && <button className='btn-dark-gray' onClick={confirmCustomer}>Confrim</button>}
                    </div>
                    { id && <StateStyle /> }
                </div>
                <div className="p-4 border grid gap-4 bg-white">
                    <div className="grid gap-4">
                        <div className="form-group w-full">
                            <label htmlFor="">Name</label>
                            <div className="input" disabled>{customer.name}</div>
                        </div>
                        <div className="form-group w-full">
                            <label htmlFor="">Business</label>
                            <div className="input" disabled>{customer.business}</div>
                        </div>
                    </div>
                    <div className='mt-4 grid gap-8'>
                        <div>
                            <span className='text-2xl font-semibold'>Address</span>
                            <div className='mt-4 flex gap-10'>
                                <div className='flex flex-col gap-4 w-full'>
                                    <div className="form-group">
                                        <label htmlFor="">Street</label>
                                        <div className="input" disabled>{customer?.address?.street}</div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Barangay</label>
                                        <div className="input" disabled>{customer?.address?.barangay}</div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Municipal</label>
                                        <div className="input" disabled>{customer?.address?.municipal}</div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full'>
                                    <div className="form-group">
                                        <label htmlFor="">Province</label>
                                        <div className="input" disabled>{customer?.address?.province}</div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Country</label>
                                        {
                                            country.map((country, idx) => {
                                                if(country === customer?.address?.country) return <div className="input" key={idx} disabled>{country}</div>;
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className='text-2xl font-semibold'>Contact</span>
                            <div className='mt-4 grid grid-cols-2 w-full gap-10'>
                                <div className="form-group">
                                    <label htmlFor="">Phone Number</label>
                                    <div className="input" disabled>{customer?.contact?.phoneNumber}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Email</label>
                                    <div className="input" disabled>{customer.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CustomerForm;