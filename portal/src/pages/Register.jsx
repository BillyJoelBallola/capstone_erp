import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { country } from "../static/country";
import * as Yup from "yup";
import axios from 'axios';

// PLAN TODO: Wait for accepting registered accounts by admins;

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [registerDone, setRegisterDone] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            business: "",
            email: "",
            street: "",
            barangay: "",
            municipal: "",
            province: "",
            country: "",
            phoneNumber: "",
            image: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Name is required"),
            business: Yup.string()
                .required("Business is required"),
            email: Yup.string()
                .email("Email is invalid"),
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
            password: Yup.string()
                .min(8, "Password must be 8 characters or more")
                .required("Password is required."),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Confirm Password not match")
                .required("Confirm Password is required."),
            phoneNumber: Yup.number()
                .min(11, "Phone number must be 11 characters.")
                .required("Phone number is required.")
        }),
        onSubmit: async (values) => {
            const val = { 
                name: values.name, 
                business: values.business, 
                email: values.email, 
                account: {
                    image: values.image, 
                    password: values.confirmPassword
                }, 
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
            };
            
            const response = await axios.post("/erp/add_customer", val);
            if(typeof response.data === "object"){
                // setRegisterDone(true);
                await axios.post("/erp/add_cart", { customerId: response.data._id });
                navigate("/login");
            }else{
                return toast.error(response.data, { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    const nextStep = () => {
        const { name, business, email, street, barangay, municipal, province, country, phoneNumber } = formik.errors;
        const errors = { name, business, email, street, barangay, municipal, province, country, phoneNumber };
        let hasErrors = false;
        Object.keys(errors).map(error => {
            if(errors[`${error}`] !== undefined){
                hasErrors = true;
            }
        })
        if(hasErrors) return;
        setStep(2);
    }

    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <div className='grid place-content-center py-28 h-full'>
                <div className='grid gap-8 w-full mx-auto md:w-[450px] lg:w-[550px]'>
                    <div className='flex flex-col gap-5 items-center'>
                        <span className='font-semibold text-2xl'>Create your account here.</span>
                        <div className='flex gap-5 justify-center'>
                            <span className={`font-semibold border-2 border-x-0 border-t-0 ${step === 1 ? "border-[#D83A6B] text-[#D83A6B]" : "border-gray-400 text-gray-400"}`}>1. Information</span>
                            <span className={`font-semibold border-2 border-x-0 border-t-0 ${step === 2 ? "border-[#D83A6B] text-[#D83A6B]" : "border-gray-400 text-gray-400"}`}>2. Account</span>
                        </div>
                    </div>
                    {
                        step === 1 && registerDone === false &&
                        <div className='grid gap-4 border rounded-md p-4'>
                            <div className='grid md:grid-cols-2 md:gap-5 gap-2'>
                                <div className="form-group">
                                    <label htmlFor="" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Name"}
                                    </label>
                                    <input 
                                        autoFocus
                                        type="text"
                                        placeholder='Full Name' 
                                        name='name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className={`${formik.touched.business && formik.errors.business ? "text-red-400" : ""}`}>
                                        {formik.touched.business && formik.errors.business ? formik.errors.business : "Business"}
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder='Business' 
                                        name='business'
                                        value={formik.values.business}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                            <div className='h-[.5px] bg-gray-300 w-full'/>
                            <div className='grid gap-3'>
                                <div className='grid md:grid-cols-2 md:gap-5 gap-2'>
                                    <div className="form-group">
                                        <label htmlFor="" className={`${formik.touched.street && formik.errors.street ? "text-red-400" : ""}`}>
                                            {formik.touched.street && formik.errors.street ? formik.errors.street : "Street"}
                                        </label>
                                        <input 
                                            type="text"
                                            placeholder='Street' 
                                            name='street'
                                            value={formik.values.street}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
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
                                </div>
                                <div className='grid md:grid-cols-2 md:gap-5 gap-2'>
                                    <div className="form-group">
                                        <label htmlFor="" className={`${formik.touched.municipal && formik.errors.municipal ? "text-red-400" : ""}`}>
                                            {formik.touched.municipal && formik.errors.municipal ? formik.errors.municipal : "Municipal"}
                                        </label>
                                        <input 
                                            type="text"
                                            placeholder='Munical' 
                                            name='municipal'
                                            value={formik.values.municipal}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
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
                                            country.map((item, idx) => (
                                                <option value={item} key={idx}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='h-[.5px] bg-gray-300 w-full'/>
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
                            <div className='flex gap-2 justify-end'>
                                <NavLink to="/login" className='btn-dark-outlined'>Cancel</NavLink>
                                <button className='btn-dark px-4 py-1 flex gap-1 items-center' onClick={nextStep}>
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" className="w-5 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    }
                    {
                        step === 2 && registerDone === false &&
                        <form className='grid gap-4 border rounded-md p-4' onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="" className={`${formik.touched.email && formik.errors.email ? "text-red-400" : ""}`}>
                                    {formik.touched.email && formik.errors.email ? formik.errors.email : "Email"}
                                </label>   
                                <input 
                                    type="email"
                                    name='email'
                                    placeholder='Email Address' 
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className={`${formik.touched.password && formik.errors.password ? "text-red-400" : ""}`}>
                                    {formik.touched.password && formik.errors.password ? formik.errors.password : "Password"}
                                </label>   
                                <input 
                                    type="password"
                                    name='password'
                                    placeholder='Password' 
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className={`${formik.touched.confirmPassword && formik.errors.confirmPassword ? "text-red-400" : ""}`}>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : "Confirm Password"}
                                </label>   
                                <input 
                                    type="password"
                                    name='confirmPassword'
                                    placeholder='confirmPassword' 
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className='flex gap-2 justify-end'>
                                <div className='btn-dark-outlined' onClick={() => setStep(1)}>
                                    Back
                                </div>
                                <button type='submit' className='btn-dark px-4 py-1 border border-transparent flex items-center gap-1'>
                                    Register
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" className="w-5 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    }
                    {/* {
                        registerDone &&
                        <div>

                        </div>
                    } */}
                </div>
            </div>
        </>
    )
}

export default Register;