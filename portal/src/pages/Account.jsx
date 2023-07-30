import React, { useContext, useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CustomerContext } from '../context/CustomerContext';
import { TabView, TabPanel } from 'primereact/tabview';
import { NavLink, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Divider } from 'primereact/divider';
import { country } from '../static/country';
import { useFormik } from 'formik';
import moment from "moment";
import * as Yup from "yup";
import axios from 'axios';

// TODO: function for changes in security

const NoOrders = () => {
    return (
        <div>
            <span>No Orders</span>
        </div>
    )
}

const Account = () => {
    let tab = useParams().tab;
    let sub = useParams().sub;
    tab === undefined ? tab = "profile" : "";
    const { currentCustomer, setUpdate } = useContext(CustomerContext);
    const [loading, setLoading] = useState(true);
    const [orderAction, setOrderAction] = useState("");
    const [orders, setOrders] = useState(null);
    const [pendings, setPendings] = useState(null);
    const [ships, setShips] = useState(null);
    const [receives, setReceives] = useState(null);
    const [completed, setCompleted] = useState(null);
    const [cancelled, setCancelled] = useState(null);
    const [cancel, setCancel] = useState(null);
    const [shipments, setShipments] = useState(null);

    useEffect(() => {
        if(orders || orderAction){
            setPendings(() => orders.filter(item => item.state === 1));
            setShips(() => orders.filter(item => item.state === 2));
            setReceives(() => orders.filter(item => item.state === 3));
            setCompleted(() => orders.filter(item => item.state === 4));
            setCancelled(() => orders.filter(item => item.state === 5));
        }
    }, [orders])
    
    useEffect(() => {
        if(!orders || orderAction){
            axios.get("/erp/customer_orders").then(({ data }) => {
                setOrders(data);
                setOrderAction("");
            })
        }
    }, [orderAction]) 

    useEffect(() => {
        axios.get("/erp/shipments").then(({ data }) => {
            setShipments(data);
        })
    }, []) 
    
    useEffect(() => {
        if(currentCustomer || cancel){
            setLoading(false);
            setCancel("");
            formik.values.name = currentCustomer.name;
            formik.values.business = currentCustomer.business;
            formik.values.phoneNumber = currentCustomer.contact.phoneNumber;
            formik.values.street = currentCustomer.address.street;
            formik.values.barangay = currentCustomer.address.barangay;
            formik.values.municipal = currentCustomer.address.municipal;
            formik.values.province = currentCustomer.address.province;
            formik.values.country = currentCustomer.address.country;
        }
    }, [currentCustomer, cancel])

    const cancelOrder = async (id) => {
        const response = await axios.put("/erp/change_order_state", { id: id, state: 5 });
        if(response.statusText === "OK"){
            setOrderAction("change");
            return toast.success("Order has been cancelled.", { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Failed to cancel order.", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            business: "",
            street: "",
            barangay: "",
            municipal: "",
            province: "",
            country: "",
            phoneNumber: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Name is required"),
            business: Yup.string()
                .required("Business is required"),
            street: Yup.string()
                .required("Street is requred"),
            barangay: Yup.string()
                .required("Barangay is requred"),
            municipal: Yup.string()
                .required("Municipal is requred"),
            province: Yup.string()
                .required("Province is requred"),
            country: Yup.string()
                .required("Country is requred"),
            phoneNumber: Yup.number()
                .min(11, "Phone Number must be 11 characters.")
                .required("Phone Number is required.")
        }),
        onSubmit: async (values) => {
            const val = {
                id: currentCustomer._id,
                name: values.name, 
                business: values.business, 
                address: {
                    street: values.street, 
                    barangay: values.barangay, 
                    municipal: values.municipal, 
                    province: values.province, 
                    country: values.country
                }, 
                contact: {
                    phoneNumber: values.phoneNumber
                } 
            }
            
            const response = await axios.put("/erp/update_customer_information", val);
            if(response.statusText === "OK"){
                setUpdate("editInformation");
                return toast.success("Profile information edited successfully.", { position: toast.POSITION.TOP_RIGHT });
            }else{
                return toast.error("Failed to edit profile information.", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            {   
                loading ?
                <div className='grid place-items-center pt-32'>
                    <ProgressSpinner />
                </div> 
                :
                <div className='py-28 side-margin flex gap-5'>
                    <div className='basis-[350px]'>   
                        <div className='grid py-2'>
                            <span className='font-semibold'>{currentCustomer?.name}</span>
                            <span className='text-sm'>{currentCustomer?.email}</span>
                        </div>
                        <div className='h-[1px] bg-gray-300' />
                        <ul className='pt-6 grid gap-2'>
                            <li>
                                <NavLink to="/account/profile/information" className={`flex gap-2 items-center font-semibold text-sm hover:text-blue-500 duration-150 ${tab === "profile" ? "text-blue-400" : "text-black"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    My Account
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/account/purchase"  className={`flex gap-2 items-center font-semibold text-sm hover:text-blue-500 duration-150 ${tab === "purchase" ? "text-blue-400" : "text-black"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                                    </svg>
                                    My Purchase
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className='w-full'>
                        {
                            tab === "profile" &&
                            <div>
                                <div className='mt-4 text-gray-600'>
                                    <span className='font-semibold'>My Account</span>
                                </div>
                                <Divider />
                                <div>
                                    <div className='flex gap-3 items-center'>
                                        <NavLink to="/account/profile/information" className={`${sub === "information" ? "border-gray-600 rounded-lg" : "border-transparent"} border p-1 text-gray-600 `}>Information</NavLink>
                                        <NavLink to="/account/profile/security" className={`${sub === "security" ? "border-gray-600 rounded-lg" : "border-transparent"} border p-1 text-gray-600 `}>Security</NavLink>
                                    </div>
                                    <div className='mt-6'>
                                        {
                                            sub === "information" &&
                                            <form className='grid gap-5' onSubmit={formik.handleSubmit}>
                                                <div className='grid grid-cols-2 gap-5'>
                                                    <div className="form-group">
                                                        <label htmlFor="name" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                                            {formik.touched.name && formik.errors.name ? formik.errors.name : "Name"}
                                                        </label>
                                                        <input 
                                                            autoFocus
                                                            id='name'
                                                            type="text"
                                                            name='name' 
                                                            placeholder='Full Name'
                                                            value={formik.values.name}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="business" className={`${formik.touched.business && formik.errors.business ? "text-red-400" : ""}`}>
                                                            {formik.touched.business && formik.errors.business ? formik.errors.business : "Business"}
                                                        </label>
                                                        <input 
                                                            id='business'
                                                            type="text"
                                                            name='business' 
                                                            placeholder='Business'
                                                            value={formik.values.business}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="phoneNumber" className={`${formik.touched.phoneNumber && formik.errors.phoneNumber ? "text-red-400" : ""}`}>
                                                        {formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber : "Phone Number"}
                                                    </label>
                                                    <input 
                                                        id='phoneNumber'
                                                        type="number"
                                                        name='phoneNumber' 
                                                        placeholder='Phone Number'
                                                        value={formik.values.phoneNumber}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </div>
                                                <div className='grid gap-5'>
                                                    <div className='grid grid-cols-2 gap-5'>
                                                        <div className="form-group">
                                                            <label htmlFor="street" className={`${formik.touched.street && formik.errors.street ? "text-red-400" : ""}`}>
                                                                {formik.touched.street && formik.errors.street ? formik.errors.street : "Street"}
                                                            </label>
                                                            <input 
                                                                id='street'
                                                                type="text"
                                                                name='street' 
                                                                placeholder='Street'
                                                                value={formik.values.street}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="barangay" className={`${formik.touched.barangay && formik.errors.barangay ? "text-red-400" : ""}`}>
                                                                {formik.touched.barangay && formik.errors.barangay ? formik.errors.barangay : "Barangay"}
                                                            </label>
                                                            <input 
                                                                id='barangay' 
                                                                type="text"
                                                                name='barangay' 
                                                                placeholder='Barangay'
                                                                value={formik.values.barangay}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='grid grid-cols-2 gap-5'>
                                                        <div className="form-group">
                                                            <label htmlFor="municipal" className={`${formik.touched.municipal && formik.errors.municipal ? "text-red-400" : ""}`}>
                                                                {formik.touched.municipal && formik.errors.municipal ? formik.errors.municipal : "Municipal"}
                                                            </label>
                                                            <input 
                                                                type="text"
                                                                name='municipal' 
                                                                id='municipal' 
                                                                placeholder='Municipal'
                                                                value={formik.values.municipal}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="province" className={`${formik.touched.province && formik.errors.province ? "text-red-400" : ""}`}>
                                                                {formik.touched.province && formik.errors.province ? formik.errors.province : "Province"}
                                                            </label>
                                                            <input 
                                                                type="text"
                                                                name='province' 
                                                                id='province' 
                                                                placeholder='Province'
                                                                value={formik.values.province}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="country">Country</label>
                                                    <select
                                                        name='country' 
                                                        id='country' 
                                                        value={formik.values.country}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <option value="">-- select country --</option>
                                                        {
                                                            country?.map((item, idx) => (
                                                                <option value={item.name} key={idx}>{item}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='grid grid-cols-2 gap-5'>
                                                    <div className='btn-gray py-2 text-center cursor-pointer' onClick={() => setCancel("cancelEdit")}>Cancel</div>
                                                    <button className='btn-dark py-2' type='submit'>Save</button>
                                                </div>
                                            </form>
                                        }
                                        {   
                                            sub === "security" &&
                                            <div>Security</div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            tab === "purchase" &&
                            <TabView>
                                <TabPanel header="Pending"> 
                                    {       
                                        pendings?.length > 0 ? 
                                        pendings?.map((order, idx) => (
                                            <div key={order._id}>
                                                { idx !== 0 && <Divider />}
                                                <div  className='grid gap-5'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='font-semibold'>{order.reference} - ₱{order.total}</span>
                                                        <button className='text-sm whitespace-nowrap underline hover:text-red-500' onClick={() => cancelOrder(order._id)}>Cancel Order</button>
                                                    </div>
                                                    <div className='grid gap-3 pl-10'>
                                                        {
                                                            order.orders.map(ord => (
                                                                <div key={ord.productId} className='flex gap-5 items-center'>
                                                                    <div className='w-20 md:w-24 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                                                        <img src={`http://localhost:4000/uploads${ord.productImage}`} alt={ord.productName} className='object-fit aspect-square'/>
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <div className='flex items-center justify-between font-semibold'>
                                                                            <NavLink to={`/preview/${ord.productId}`} className="hover:text-blue-400">{ord.productName}</NavLink>
                                                                            <p>₱{ord.totalPrice}</p>
                                                                        </div>
                                                                        <p className='text-sm'>Quantity: {ord.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <NoOrders />
                                    }
                                </TabPanel>
                                <TabPanel header="Ship">
                                    {       
                                        ships?.length > 0 ? 
                                        ships?.map((order, idx) => (
                                            <div key={order._id}>
                                                { idx !== 0 && <Divider />}
                                                <div  className='grid gap-5'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='grid'>
                                                            <span className='font-semibold'>{order.reference} - ₱{order.total}</span>
                                                            {
                                                                shipments?.map(item => (
                                                                    item.order._id === order._id &&
                                                                    <span className='text-sm' key={item._id}>Expected Arrival: {item.expectedArrival ? moment(item.expectedArrival).format("LL") : "processing"}</span>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='grid gap-3 pl-10'>
                                                        {
                                                            order.orders.map(ord => (
                                                                <div key={ord.productId} className='flex gap-5 items-center'>
                                                                    <div className='w-20 md:w-24 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                                                        <img src={`http://localhost:4000/uploads${ord.productImage}`} alt={ord.productName} className='object-fit aspect-square'/>
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <div className='flex items-center justify-between font-semibold'>
                                                                            <NavLink to={`/preview/${ord.productId}`} className="hover:text-blue-400">{ord.productName}</NavLink>
                                                                            <p>₱{ord.totalPrice}</p>
                                                                        </div>
                                                                        <p className='text-sm'>Quantity: {ord.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <NoOrders />
                                    }
                                </TabPanel>
                                <TabPanel header="Receive">
                                    {       
                                        receives?.length > 0 ? 
                                        receives?.map((order, idx) => (
                                            <div key={order._id}>
                                                { idx !== 0 && <Divider />}
                                                <div  className='grid gap-5'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='grid'>
                                                            <span className='font-semibold'>{order.reference} - ₱{order.total}</span>
                                                            {
                                                                shipments?.map(item => (
                                                                    item.order._id === order._id &&
                                                                    <span className='text-sm' key={item._id}>Expected Arrival: {item.expectedArrival ? moment(item.expectedArrival).format("LL") : "processing"}</span>
                                                                ))
                                                            }
                                                        </div>
                                                        <button className='btn-gray'>Receive All</button>
                                                    </div>
                                                    <div className='grid gap-3 pl-10'>
                                                        {
                                                            order.orders.map(ord => (
                                                                <div key={ord.productId} className='flex gap-5 items-center'>
                                                                    <div className='w-20 md:w-24 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                                                        <img src={`http://localhost:4000/uploads${ord.productImage}`} alt={ord.productName} className='object-fit aspect-square'/>
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <div className='flex items-center justify-between font-semibold'>
                                                                            <NavLink to={`/preview/${ord.productId}`} className="hover:text-blue-400">{ord.productName}</NavLink>
                                                                            <p>₱{ord.totalPrice}</p>
                                                                        </div>
                                                                        <p className='text-sm'>Quantity: {ord.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <NoOrders />
                                    }
                                </TabPanel>
                                <TabPanel header="Completed">
                                    {       
                                        completed?.length > 0 ? 
                                        completed?.map((order, idx) => (
                                            <div key={order._id}>
                                                { idx !== 0 && <Divider />}
                                                <div  className='grid gap-5'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='grid'>
                                                            <span className='font-semibold'>{order.reference} - ₱{order.total}</span>
                                                            {
                                                                shipments?.map(item => (
                                                                    item.order._id === order._id &&
                                                                    <span className='text-sm' key={item._id}>Expected Arrival: {item.expectedArrival ? moment(item.expectedArrival).format("LL") : "processing"}</span>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='grid gap-3 pl-10'>
                                                        {
                                                            order.orders.map(ord => (
                                                                <div key={ord.productId} className='flex gap-5 items-center'>
                                                                    <div className='w-20 md:w-24 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                                                        <img src={`http://localhost:4000/uploads${ord.productImage}`} alt={ord.productName} className='object-fit aspect-square'/>
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <div className='flex items-center justify-between font-semibold'>
                                                                            <NavLink to={`/preview/${ord.productId}`} className="hover:text-blue-400">{ord.productName}</NavLink>
                                                                            <p>₱{ord.totalPrice}</p>
                                                                        </div>
                                                                        <p className='text-sm'>Quantity: {ord.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <NoOrders />
                                    }
                                </TabPanel>
                                <TabPanel header="Cancelled">
                                    {       
                                        cancelled?.length > 0 ? 
                                        cancelled?.map((order, idx) => (
                                            <div key={order._id}>
                                                { idx !== 0 && <Divider />}
                                                <div  className='grid gap-5'>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='font-semibold'>{order.reference} - ₱{order.total}</span>
                                                        <span className='text-sm whitespace-nowrap text-red-500'>Cancelled</span>
                                                    </div>
                                                    <div className='grid gap-3 pl-10'>
                                                        {
                                                            order.orders.map(ord => (
                                                                <div key={ord.productId} className='flex gap-5 items-center'>
                                                                    <div className='w-20 md:w-24 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                                                        <img src={`http://localhost:4000/uploads${ord.productImage}`} alt={ord.productName} className='object-fit aspect-square'/>
                                                                    </div>
                                                                    <div className='w-full'>
                                                                        <div className='flex items-center justify-between font-semibold'>
                                                                            <NavLink to={`/preview/${ord.productId}`} className="hover:text-blue-400">{ord.productName}</NavLink>
                                                                            <p>₱{ord.totalPrice}</p>
                                                                        </div>
                                                                        <p className='text-sm'>Quantity: {ord.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <NoOrders />
                                    }
                                </TabPanel>
                            </TabView>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default Account;