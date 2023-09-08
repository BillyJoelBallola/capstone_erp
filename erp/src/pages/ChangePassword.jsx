import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import logo from "../assets/micaella-logo.png";
import { NavLink, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ChangePassword = () => {
    const email = useParams().email;
    const [login, setLogin] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(8, "Password must be 8 characters or more")
                .required("Password is required."),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Confirm password not match")
                .required("Confirm Password is required.") 
        }),
        onSubmit: async (values) => {
            const response = await axios.put("/erp/change_password", { email: `${email}@gmail.com`, password: values.confirmPassword });
            if(response.statusText === "OK"){
                setLogin(true);
                return toast.success("Password change successfully.", { position: toast.POSITION.BOTTOM_RIGHTGHTGHTGHT });
            }else{
                return toast.error("Failed to change password. Try again.", { position: toast.POSITION.BOTTOM_RIGHTGHTGHTGHT });
            }
        }
    })

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            {/* <div className="w-screen h-screen grid place-content-center font-roboto">
                <div className="flex flex-col items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div>
                        <img
                            className="w-32"
                            src={logo}
                            alt="micaella's logo" />
                        </div>
                        <div className="h-full w-[2px] bg-gray-300"></div>
                        <div className="font-bold">
                        <span className="text-5xl tracking-[.5rem]">ERP</span>
                            <br/>
                        <span className="text-md tracking-[.5rem]">SYSTEM</span>
                        </div>
                    </div>
                    {
                        login ? 
                        <div className='bg-white w-[300px] p-5 flex flex-col gap-2 items-center justify-center rounded-lg drop-shadow-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00aa4a" className="w-20 h-20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            <NavLink to="/login" className="text-right text-sm underline">Click to Login</NavLink>
                        </div>
                        :
                        <form className="flex flex-col gap-4 w-[300px] bg-white p-5 rounded-lg drop-shadow-lg" onSubmit={formik.handleSubmit}>
                            <span className='text-sm text-gray-500'>Your email, {email}@gmail.com</span>
                            <div className="form-group">
                                <label 
                                    className={`${formik.touched.newPassword && formik.errors.newPassword ? "text-red-400" : ""}`}
                                    htmlFor="">
                                    {formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : "Password"}
                                </label>
                                <input 
                                    autoFocus
                                    type="password" 
                                    placeholder="Password"
                                    name='newPassword'
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="form-group">
                                <label 
                                    className={`${formik.touched.confirmPassword && formik.errors.confirmPassword ? "text-red-400" : ""}`}
                                    htmlFor="">
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : "Confirm Password"}
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="Confirm Password"
                                    name='confirmPassword'
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        
                            <button type="submit" className="btn-dark py-3">Save Password</button>
                        </form>
                    }
                </div>
            </div> */}
            <div className="w-screen h-screen grid place-content-center font-roboto bg-white">
                <div className="flex flex-col items-center gap-8 w-screen">
                    <div className="flex items-center gap-4">
                        <div className='w-32'>
                            <img
                                className="object-contain"
                                src={logo}
                                alt="micaella's logo" />
                        </div>
                        <div className="h-full w-[2px] bg-gray-300"></div>
                        <div className="font-bold">
                            <span className="text-5xl tracking-[.5rem]">ERP</span>
                                <br/>
                            <span className="text-md tracking-[.5rem]">SYSTEM</span>
                        </div>
                    </div>
                    {
                        login ?
                        <div className='bg-white w-[90%] md:w-[50%] lg:w-[30%] p-5 flex flex-col gap-2 items-center justify-center rounded-lg drop-shadow-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00aa4a" className="w-20 h-20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            <NavLink to="/login" className="text-right text-sm underline">Click to Login</NavLink>
                        </div>
                        :
                        <form className="flex flex-col gap-4 w-[90%] md:w-[50%] lg:w-[30%] border p-5 rounded-lg" onSubmit={formik.handleSubmit}>
                            <span className='text-sm text-gray-500'>Your email, {email}@gmail.com</span>
                            <div className="form-group">
                                <label 
                                    className={`${formik.touched.newPassword && formik.errors.newPassword ? "text-red-400" : ""}`}
                                    htmlFor="">
                                    {formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : "Password"}
                                </label>
                                <input 
                                    autoFocus
                                    type="password" 
                                    placeholder="Password"
                                    name='newPassword'
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className="form-group">
                                <label 
                                    className={`${formik.touched.confirmPassword && formik.errors.confirmPassword ? "text-red-400" : ""}`}
                                    htmlFor="">
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : "Confirm Password"}
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="Confirm Password"
                                    name='confirmPassword'
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <button type="submit" className="btn-dark py-3">Save Password</button>
                        </form>
                    }
                </div>
            </div>
        </>
    )
}

export default ChangePassword;