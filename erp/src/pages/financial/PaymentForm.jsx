import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from "yup";
import axios from 'axios';

const PaymentForm = () => {
    const id = useParams().id;
    const entity = useParams().entity;
    const navigate = useNavigate();
    const { settings } = useContext(UserContext);
    const [isBankMethod, setIsBankMethod] = useState(true);
    const [reference, setReference] = useState("");
    const [suppliers, setSuppliers] = useState([]);  
    const [customers, setCustomers] = useState([]);  
    const [billData, setBillData] = useState({
        reference: "",
        id: "",
        purchase: ""
    });
    const [type, setType] = useState({
        send: true,
        receive: false
    })
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    useEffect(() => {
        if(entity === "customers"){
            setType({
                send: false,
                receive: true
            })
        }
    }, [entity])

    const formik = useFormik({
        initialValues: {
            journal: "",
            method: "",
            bank: "",
            date: "",
            memo: "",
            supplier: "",
            customer: "",
            amount: 0
        },
        validationSchema: Yup.object({
            journal: Yup.string()
                .required("Journal is required."),
            method: Yup.string()
                .required("Payment Method is required."),
            supplier: Yup.string()
                .required("Supplier is required."),
            customer: Yup.string()
                .required("Customer is required."),
            date: Yup.date()
                .min(moment(yesterday).format(), "Payment Date must be either today or a future date.")
                .required("Payment Date is required."),
            amount: Yup.number()
                .required("₱ Amount is required."),
        }),
        onSubmit: async (values) => {
            if(id){
                const response = await axios.put("/erp/update_payment", { ...values, id: id });
                if(response.statusText === "OK"){
                    return toast.success("Payment successfully edited.", { position: toast.POSITION.BOTTOM_RIGHT });
                }else{
                    return toast.error("Failed to edit payment.", { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_payment", { ...values, type: type, reference: referenceGenerator("SPAY") });
                if(response.statusText === "OK"){
                    navigate(`/financial/payments/payment-form/${response.data._id}`);
                    return toast.success("Payment successfully added.", { position: toast.POSITION.BOTTOM_RIGHT });
                }else{
                    return toast.error("Failed to add payment.", { position: toast.POSITION.BOTTOM_RIGHT });
                }
            }
        }
    })

    useEffect(() => {
        if(id){
            axios.get(`/erp/payment/${id}`).then(({ data }) => {
                formik.values.journal = data.journal;
                formik.values.method = data.method;
                formik.values.date = moment(data.date).format().toString().slice(0, 10);
                formik.values.memo = data.memo;
                formik.values.amount = data.amount;
                formik.values.supplier = data?.supplier?._id;
                formik.values.customer = data?.customer?._id;
                setReference(data.reference);
                setType(data.type);
                if(data.bill){
                    setBillData({
                        reference: data.bill.reference, 
                        id: data.bill._id, 
                        purchase: data.bill.purchase
                    });
                }
            })
        }
    }, [id])

    useEffect(() => {   
        axios.get("/erp/suppliers").then(({ data }) => {
            setSuppliers(data)
        })
        axios.get("/erp/customers").then(({ data }) => {
            setCustomers(data)
        })
    }, [])

    useEffect(() => {
        formik.values.journal === "Bank" ? setIsBankMethod(true) : setIsBankMethod(false);
    }, [formik.values.journal])

    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <div>
                <div className="fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className='flex items-center gap-3'>       
                        <button type="submit" className="btn-outlined px-4" form="user-form">
                            {id ? "Edit" : "Save"}
                        </button>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">Payment</span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span className="">
                                    {id ? reference : "New"}
                                </span>
                                {
                                    id && billData.reference &&
                                    <NavLink className="text-blue-400" to={`/financial/bills/bill-form/${billData.purchase}/${billData.id}`}>({billData.reference})</NavLink>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <form className="p-4 border bg-white" id="user-form" onSubmit={formik.handleSubmit}>
                        <div className='form-group mb-5'>
                            <span className='text-sm'>Payment Type</span>
                            <div className='flex gap-5'>
                                <div className='flex items-center gap-2'>
                                    <input
                                        disabled={id ? true : false} 
                                        type="radio" 
                                        name='type'
                                        checked={type.send}
                                        onChange={() => setType({send: true, receive: false})}
                                    />
                                     <label htmlFor="">Send</label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input
                                        disabled={id ? true : false} 
                                        type="radio" 
                                        name='type'
                                        checked={type.receive}
                                        onChange={() => setType({send: false, receive: true})}
                                    />
                                    <label htmlFor="">Receive</label>
                                </div>
                            </div>
                        </div>
                        <div className='grid gap-10 grid-cols-2'>
                            <div className='flex flex-col gap-5'>
                                <div className="form-group">
                                    {
                                        entity === "suppliers" &&
                                        <>
                                            <label
                                                htmlFor=""
                                                className={`${
                                                    formik.touched.supplier &&
                                                    formik.errors.supplier
                                                        ? "text-red-400"
                                                        : ""
                                                }`}
                                            >
                                                {formik.touched.supplier &&
                                                formik.errors.supplier
                                                    ? formik.errors.supplier
                                                    : "Supplier"}
                                            </label>
                                            <select
                                                disabled={id ? true : false} 
                                                name="supplier"
                                                value={formik.values.supplier}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select supplier --</option> 
                                                {
                                                    suppliers?.map(supplier => (
                                                        <option value={supplier._id} key={supplier._id}>{supplier.business}</option> 
                                                    ))
                                                }
                                            </select>
                                        </>
                                    }
                                    {
                                        entity === "customers" &&
                                        <>
                                            <label
                                                htmlFor=""
                                                className={`${
                                                    formik.touched.customer &&
                                                    formik.errors.customer
                                                        ? "text-red-400"
                                                        : ""
                                                }`}
                                            >
                                                {formik.touched.customer &&
                                                formik.errors.customer
                                                    ? formik.errors.customer
                                                    : "Customer"}
                                            </label>
                                            <select
                                                disabled={id ? true : false} 
                                                name="customer"
                                                value={formik.values.customer}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select customer --</option> 
                                                {
                                                    customers?.map(customer => (
                                                        <option value={customer._id} key={customer._id}>{customer.business}</option> 
                                                    ))
                                                }
                                            </select>
                                        </>
                                    }
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.amount &&
                                            formik.errors.amount
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.amount &&
                                        formik.errors.amount
                                            ? formik.errors.amount
                                            : "₱ Amount"}
                                    </label>
                                    <input     
                                        disabled={id ? true : false} 
                                        type='number'
                                        name='amount'
                                        placeholder='₱ 0.00'
                                        value={formik.values.amount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.date &&
                                            formik.errors.date
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.date &&
                                        formik.errors.date
                                            ? formik.errors.date
                                            : "Payment Date"}
                                    </label>
                                    <input     
                                        disabled={id ? true : false} 
                                        type='date'
                                        name='date'
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.memo &&
                                            formik.errors.memo
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.memo &&
                                        formik.errors.memo
                                            ? formik.errors.memo
                                            : "Memo"}
                                    </label>
                                    <input     
                                        type='text'
                                        name='memo'
                                        placeholder='e.g. Customer Payment, Bill Reference'
                                        value={formik.values.memo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-5'>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.journal &&
                                            formik.errors.journal
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.journal &&
                                        formik.errors.journal
                                            ? formik.errors.journal
                                            : "Journal"}
                                    </label>
                                    <select
                                        disabled={id ? true : false} 
                                        name='journal'
                                        value={formik.values.journal}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">-- select journal --</option>
                                        {
                                            settings?.financial?.journals &&
                                            settings.financial.journals.map((journal, idx) => (
                                                <option value={journal.name} key={idx}>{journal.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.method &&
                                            formik.errors.method
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.method &&
                                        formik.errors.method
                                            ? formik.errors.method
                                            : "Payment Method"}
                                    </label>
                                    <select
                                        disabled={id ? true : false} 
                                        name='method'
                                        value={formik.values.method}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">-- select method --</option>
                                        {
                                            settings?.financial?.paymentMethod &&
                                            settings.financial.paymentMethod.map((method, idx) => (
                                                <option value={method} key={idx}>{method}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                {
                                    isBankMethod &&
                                    <div className="form-group">
                                        <label htmlFor="">Recipient Bank Account</label>
                                        <input type="text" />
                                    </div>
                                }
                            </div>
                        </div>
                    </form>
                    {/* {
                         id && 
                         <div className='mt-4 text-sm'>
                             {`${moment(formik.values.date).format("LL")} - Raw Material Created.`}
                         </div>
                    } */}
                </div>
            </div>
        </>
    );
}

export default PaymentForm