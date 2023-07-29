import React, { useEffect, useState } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from "formik";
import { country } from "../../static/country";
import * as Yup from "yup";
import axios from 'axios';

const SupplierForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const [onTimeRate, setOnTimeRate] = useState(0);
    const [purchasesNumber, setPurchasesNumber] = useState(0);
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        axios.get("/erp/purchases").then(({ data }) => {
            const purchasesData = data.filter(item => item.supplier._id === id);
            setPurchases(purchasesData);
            setPurchasesNumber(purchasesData?.length);
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            name: "",
            business: "",
            street: "",
            barangay: "",
            municipal: "",
            province: "",
            country: "",
            email: "",
            phoneNumber: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
            .min(5, "Name must be 5 characters or more.")
            .required("Name is required."),
            business: Yup.string()
                .required("Business is required."),
            barangay: Yup.string()
                .required("Barangay is required."),
            municipal: Yup.string()
                .required("Municipal is required."),
            province: Yup.string()
                .required("Province is required."),
            country: Yup.string()
                .required("Country is required."),
            email: Yup.string()
                .email("Invalid email address."),
            phoneNumber: Yup.number()
                .min(11, "Phone Number must be 11 characters")
                .required("Phone Number is required."),
        }),
        onSubmit: async (values) => {
            const address = { street: values.street, barangay: values.barangay, municipal: values.municipal, province: values.province, country: values.country };
            const contact = { phoneNumber: values.phoneNumber, email: values.email };
            const newValues = { name: values.name, business: values.business, address: address, contact: contact, id: id };
            
            if(id){
                const response = await axios.put("/erp/update_supplier", newValues);
                if(response.statusText === "OK"){
                    return toast.success("Supplier succefully edited.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to edit supplier.", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_supplier", newValues);
                if(response.statusText === "OK"){
                    navigate(`/${op}/suppliers/supplier-form/${response.data._id}`);
                    return toast.success("Supplier succefully added.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add supplier.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })
    
    useEffect(() => {
        if(purchases){
            const onTimeOrders = purchases.filter(purchase => new Date(purchase.date) <= new Date(purchase.expectedArrival));
            setOnTimeRate((onTimeOrders.length / purchasesNumber ) * 100);
        }
    }, [id, purchases])

    useEffect(() => {
        if(id){
            axios.get(`/erp/supplier/${id}`).then(({ data }) => {
                formik.values.name = data.name;
                formik.values.business = data.business;
                formik.values.street = data.address?.street;
                formik.values.barangay = data.address.barangay;
                formik.values.municipal = data.address.municipal;
                formik.values.province = data.address.province;
                formik.values.country = data.address.country;
                formik.values.phoneNumber = data.contact.phoneNumber;
                formik.values.email = data.contact.email;
            })
        }
    }, [])

    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <ConfirmPopup />
            <div>
                <div className="fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className='flex items-center gap-3'>       
                        <div className='flex gap-2'>
                            <button type="submit" className="btn-outlined px-4" form="supplier-form">
                                {id ? "Edit" : "Save"}
                            </button>
                            <div className="grid justify-center">
                                <span className="text-lg font-semibold">Supplier</span>
                                <span className="text-sm font-semibold -mt-2">{id ? "Edit" : "New"}</span>
                            </div>
                        </div>
                    </div>
                    {
                        id && 
                        <div className='flex border border-gray-400 py-[1px] rounded-md text-xs'>
                            <div className='flex gap-1 items-center px-2 rounded-s-md hover:bg-gray-200'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                </div>
                                <div className='grid text-left'>
                                    <span>On-time Rate</span>
                                    <span className='-mt-1 font-semibold'>{isNaN(onTimeRate) ? 0 : onTimeRate}%</span>
                                </div>
                            </div>
                            <div className='h-7 bg-gray-400 w-[1px]'/>
                            <button className='flex gap-1 items-center px-2 rounded-e-md hover:bg-gray-200'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                </div>
                                <div className='grid text-left'>
                                    <span>Purchases</span>
                                    <span className='-mt-1 font-semibold'>{purchasesNumber}</span>
                                </div>
                            </button>
                        </div>
                    }
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <form className="p-4 border grid gap-4 bg-white" id="supplier-form" onSubmit={formik.handleSubmit}>
                        <div className="grid gap-4">
                            <div className="form-group w-full">
                                <label htmlFor="" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                    {formik.touched.name && formik.errors.name ? formik.errors.name : "Name"}
                                </label>    
                                <input
                                    autoFocus
                                    type="text"
                                    style={{ fontSize: "larger", fontWeight: 600 }}
                                    placeholder="e.g. John Doe"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="form-group w-full">
                                <label htmlFor="" className={`${formik.touched.business && formik.errors.business ? "text-red-400" : ""}`}>
                                    {formik.touched.business && formik.errors.business ? formik.errors.business : "Business"}
                                </label>    
                                <input
                                    type="text"
                                    placeholder="e.g. Meat Store"
                                    name="business"
                                    value={formik.values.business}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        <div className='mt-4 grid gap-8'>
                            <div>
                                <span className='text-2xl font-semibold'>Address</span>
                                <div className='mt-4 flex gap-10'>
                                    <div className='flex flex-col gap-4 w-full'>
                                        <div className="form-group">
                                            <label htmlFor="">Street</label>
                                            <input 
                                                type="text" 
                                                placeholder='Street'
                                                name='street'
                                                value={formik.values.street}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.barangay && formik.errors.barangay ? "text-red-400" : ""}`}>
                                                {formik.touched.barangay && formik.errors.barangay ? formik.errors.barangay : "Barangay"}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder='Barangay'
                                                name='barangay'
                                                value={formik.values.barangay}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.municipal && formik.errors.municipal ? "text-red-400" : ""}`}>
                                                {formik.touched.municipal && formik.errors.municipal ? formik.errors.municipal : "Municipal"}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder='Municipal'
                                                name='municipal'
                                                value={formik.values.municipal}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-4 w-full'>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.province && formik.errors.province ? "text-red-400" : ""}`}>
                                                {formik.touched.province && formik.errors.province ? formik.errors.province : "Province"}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder='Province'
                                                name='province'
                                                value={formik.values.province}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.country && formik.errors.country ? "text-red-400" : ""}`}>
                                                {formik.touched.country && formik.errors.country ? formik.errors.country : "Country"}
                                            </label>
                                            <select
                                                name='country'
                                                value={formik.values.country}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select country --</option>
                                                {
                                                    country?.map((item, idx) => (
                                                        <option value={item} key={idx}>{item}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className='text-2xl font-semibold'>Contact</span>
                                <div className='mt-4 grid grid-cols-2 w-full gap-10'>
                                    <div className="form-group">
                                        <label htmlFor="" className={`${formik.touched.phoneNumber && formik.errors.phoneNumber ? "text-red-400" : ""}`}>
                                            {formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber : "Phone Number"}
                                        </label>
                                        <input 
                                            type="number" 
                                            placeholder='Phone Number'
                                            name='phoneNumber'
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="" className={`${formik.touched.email && formik.errors.email ? "text-red-400" : ""}`}>
                                            {formik.touched.email && formik.errors.email ? formik.errors.email : "Email"}
                                        </label>
                                        <input 
                                            type="email" 
                                            placeholder='e.g erp_system@example.com'
                                            name='email'
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SupplierForm;