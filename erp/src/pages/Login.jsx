import React, { useContext } from 'react';
import logo from "../assets/micaella-logo.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address.")
                .required("Email is required."),
            password: Yup.string()
                .required("Password is required.")
            }),
        onSubmit: async (values) => {
            const response = await axios.post("/erp/login", values);
            if(typeof response.data === "object"){
                navigate("/");
                setCurrentUser(response.data);
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
        <div className="w-screen h-screen grid place-content-center font-roboto">
            <div className="flex flex-col items-center gap-8">
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
                <form className="flex flex-col gap-4 w-[300px] bg-white p-5 rounded-lg drop-shadow-lg" onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label 
                            className={`${formik.touched.email && formik.errors.email ? "text-red-400" : ""}`}
                            htmlFor="Email">
                            {formik.touched.email && formik.errors.email ? formik.errors.email : "Email"}
                        </label>
                        <input 
                            type="text" 
                            placeholder="Email Address"
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="form-group">
                        <label 
                            className={`${formik.touched.password && formik.errors.password ? "text-red-400" : ""}`}
                            htmlFor="Username">
                            {formik.touched.password && formik.errors.password ? formik.errors.password : "Password"}
                        </label>
                        <input 
                            type="password"
                            placeholder="Password"
                            name='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <a href="" className="text-right text-sm underline">Forget password?</a>
                    <button type="submit" className="btn-dark py-3">Sign in</button>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login