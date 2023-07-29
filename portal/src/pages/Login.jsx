import React, { useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

const Login = () => {
    const navigate = useNavigate();
    const { setCurrentCustomer } = useContext(CustomerContext);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email is invalid")
                .required("Email is required"),
            password: Yup.string()
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            const response = await axios.post("/erp/customer_login", values);
            if(typeof response.data === "object"){
                navigate("/");
                setCurrentCustomer(response.data);
            }else{
                return toast.error(response.data, { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <div className='grid place-content-center h-screen w-screen'>
                <div className='grid gap-8 w-96'>
                    <span className='font-semibold text-2xl text-center'>Login your account here.</span>
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
                        <button type='submit' className='btn-dark py-2'>Login</button>
                        <span className='text-xs text-center'>
                            Don't have account yet? Click to 
                            <NavLink to="/register" className="text-blue-400"> Register</NavLink>
                        </span>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;