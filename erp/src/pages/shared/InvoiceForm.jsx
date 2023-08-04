import React, { useState, useEffect} from 'react';
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import * as Yup from "yup";
import axios from "axios";
import DialogBox from '../../components/DialogBox';

// TODO: Submit in Invoice Form

const referenceGenerator = (func) => {
    const [m, d, y] = moment(Date.now()).format("L").split("/");
    return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
}

const PaymentForm = ({ invoiceData, setVisible, setAction }) => {
    const [isBankMethod, setIsBankMethod] = useState(true);
    const [amountDue, setAmountDue] = useState(0);
    const [difference, setDifference] = useState(0);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formik = useFormik({
        initialValues: {
            journal: "",
            method: "",
            type: {
                send: false,
                receive: true
            },
            bank: "",
            date: "",
            memo: "",
            customer: "",
            amount: 0
        },
        validationSchema: Yup.object({
            journal: Yup.string()
                .required("Journal is required."),
            method: Yup.string()
                .required("Payment Method is required."),
            date: Yup.date()
                .min(moment(yesterday).format(), "Payment Date must be either today or a future date.")
                .required("Payment Date is required."),
            amount: Yup.number()
                .required("₱ Amount is required."),
        }),
        onSubmit: async (values, helper) => {
            const response = await axios.post("/erp/add_payment", {...values, reference: referenceGenerator("CPAY"), invoice: invoiceData.id});
            if(response.statusText === "OK"){
                if(values.amount < amountDue){
                    await axios.put("/erp/change_invoice_payment", { payment: 2, id: invoiceData.id });
                }else{
                    await axios.put("/erp/change_invoice_payment", { payment: 3, id: invoiceData.id });
                }
                setAction("payment");
                helper.resetForm();
                setVisible(false);
            }else{
                return toast.error("Failed to add payment.", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    useEffect(() => {
        if(formik.values.amount < amountDue) {
            setDifference(() => amountDue - formik.values.amount);
        }
    }, [formik.values.amount])

    useEffect(() => {
        formik.values.journal === "Bank" ? setIsBankMethod(true) : setIsBankMethod(false);
    }, [formik.values.journal])

    useEffect(() => {   
        let finalVal = 0;
        if(invoiceData){
            if(invoiceData.payment === 2 && invoiceData.balance){
                finalVal = invoiceData.total - invoiceData.balance;
            }else{
                finalVal = invoiceData.total;
            }
            formik.values.customer = invoiceData.customer;
            formik.values.amount = finalVal;
            formik.values.date = moment(Date.now()).format().toString().slice(0, 10);
            formik.values.memo = invoiceData.reference;
            setAmountDue(finalVal);
        }
    }, [invoiceData])

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='grid grid-cols-2 gap-10'>
                <div className='flex flex-col gap-5 w-full'>
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
                            name='journal'
                            value={formik.values.journal}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">-- select journal --</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
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
                            name='method'
                            value={formik.values.method}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">-- select method --</option>
                            <option value="Manual">Manual</option>
                            {
                                isBankMethod &&
                                <option value="Cheque">Cheque</option>
                            }
                        </select>
                    </div>
                    {
                        isBankMethod &&
                        <div className="form-group">
                            <label htmlFor="">Recipient Bank Account</label>
                            <select
                                name='bank'
                                value={formik.values.bank}
                                onChange={formik.handleChange}
                            >
                                <option value="">-- bank account --</option>
                            </select>
                        </div>
                    }
                </div>
                <div className='flex flex-col gap-5 w-full'>
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
                            type="number" 
                            name='amount'
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
                            type="date" 
                            name='date'
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Memo</label>
                        <input 
                            type="text" 
                            name='memo'
                            value={formik.values.memo}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>
                {
                    formik.values.amount < amountDue &&
                    <div className='flex gap-5'>
                        <span>Payment Difference:</span>
                        <span className='font-semibold'>{difference} ₱</span>
                    </div>
                }
            </div>
            <div className='mt-6 flex justify-end'>
                <button type='submit' className='btn-primary p-2'>Payment</button>
            </div>
        </form>
    )
}

const InvoiceForm = () => {
    const id = useParams().id;
    const orderId = useParams().orderId;
    const op = useParams().op;
    const navigate = useNavigate();
    const [reference, setReference] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const [action, setAction] = useState("");
    const [state, setState] = useState(0);
    const [payment, setPayment] = useState("");
    const [visible, setVisible] = useState("");
    const [customers, setCustomers] = useState([]);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [payments, setPayments] = useState([]);
    const [amountDue, setAmountDue] = useState(0);

    useEffect(() => {
        if(!!payments){
            axios.get("/erp/payments").then(({ data }) => {
                const partial = data.filter(item => item?.invoice?._id === id && item?.invoice?.reference === reference && item?.invoice?.payment === 2);
                setPayments(partial);
                partial?.map(pay => {
                    setAmountDue(prev => prev + pay.amount);
                })
            })
        }

        if(payments){
            payments?.map(pay => {
                setAmountDue(prev => prev + pay.amount);
            })
            setAction("");
        }
    }, [payment, action])

    const formik = useFormik({
        initialValues: {
            customer: "",
            date: "",
            dueDate: "",
            journal: "",
            order: "",
            productOrder: []
        },
        validationSchema: Yup.object({
            customer: Yup.string()
                .required("Customer is required."),
            date: Yup.date()
                .required("Invoice Order is required."),
            dueDate: Yup.date()
                .required("Due Date is required."),
            journal: Yup.string()
                .min(4, "Journal must be 4 characters or more.")
                .required("Journal is required."),
        }),
        onSubmit: async (values) => {
            if(id){
                console.log(id);
            }else{
                const response = await axios.post("/erp/add_invoice", { ...values, total: total, reference: referenceGenerator("INV") });
                if(response.statusText === "OK"){
                    const id = orderId === undefined ? selectedOrderId : orderId;
                    const orderResponse = await axios.get(`/erp/order/${id}`);
                    await axios.put("/erp/change_order_state", { id: orderResponse?.data?._id, state: orderResponse?.data?.state, invoice: 3 });
                    navigate(`/${op}/invoices/invoice-form/${id}/${response.data._id}`);
                    return toast.success("Customer order successfully invoice.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Faield to invoice customer order.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })

    useEffect(() => {
        if(orderId !== undefined && id === undefined){
            axios.get(`/erp/order/${orderId}`).then(({ data }) => {
                formik.values.order = data._id;
                formik.values.customer = data?.customer?._id;
                formik.values.journal = "Customer Invoice";
                formik.values.date = moment(Date.now()).format().toString().slice(0, 10);
                formik.values.productOrder = data.orders;
                setReference(data.reference);
                setTotal(data.total);
                setAction("");
            })
        }
        if(orderId !== undefined && id !== undefined){
            axios.get(`/erp/invoice/${id}`).then(({ data }) => {
                formik.values.order = data.order;
                formik.values.customer = data.customer;
                formik.values.journal = data.journal;
                formik.values.date = data.date.toString().slice(0, 10);
                formik.values.dueDate = data.dueDate.toString().slice(0, 10);
                formik.values.productOrder = data.productOrder;
                setReference(data.reference);
                setState(data.state);
                setPayment(data.payment);
                setTotal(data.total);
                setAction("");
            })
        }
    }, [orderId, id, action]) 

    useEffect(() => {
        if(customers.length === 0){
            axios.get("/erp/customers").then(({ data }) => {
                setCustomers(data);
            })
        }
        if(customerOrders.length === 0){
            axios.get("/erp/orders").then(({ data }) => {
                setCustomerOrders(data);
            })
        }
    }, [customers, customerOrders]) 

    useEffect(() => {
        if(!id){
            if(formik.values.customer !== ""){
                const waitingOrders = customerOrders.filter(order => order.customer._id === formik.values.customer && order.invoice === 2);
                setOrders(waitingOrders);
            }else{
                setOrders([]);
                formik.values.customer = "";
                formik.values.productOrder = [];
                formik.values.order = "";
            }
        }
    }, [formik.values.customer]) 

    useEffect(() => {
        if(!id){
            if(formik.values.customer !== ""){
                const orderProducts = orders.find(order => {if(order._id === formik.values.order) return order});
                formik.values.productOrder = orderProducts?.orders;
                setSelectedOrderId(orderProducts?._id);
                setTotal(orderProducts?.total);
            }else{
                setSelectedOrderId("");
                formik.values.customer = "";
                formik.values.productOrder = [];
            }
        }
    }, [formik.values.order]) 
    
    const StateStyle = () => {
        return (
            <div className='flex items-center font-semibold text-sm'>
                { payment === 1 && <div className="text-red-600 border-red-400 bg-gray-200 border px-2 rounded-full z-10">Not Paid</div>}
                { payment === 2 && <div className="text-yellow-600 border-yellow-600 bg-gray-200 border px-2 rounded-full z-10">Partially Paid</div>}
                { payment === 3 && <div className="text-green-600 border-green-400 bg-gray-200 border px-2 rounded-full z-10">Paid</div>}
                <div className="flex justify-end">
                    <div className="max-w-min p-2 flex items-center justify-center gap-3 relative">
                        <div className="w-4/5 h-[2px] bg-gray-300 absolute"/>
                        <div className={`${state === 1 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Posted</div>
                        {
                            state === 2 &&
                            <div className={`text-blue-400 border-blue-400 bg-gray-200 border px-2 rounded-full z-10`}>Cancelled</div>
                        }
                    </div>
                </div>
            </div>
        )
    }    

    const cancelInvoice = async () => {
        const response = await axios.put("/erp/change_invoice_state", { state: 2, id: id });
        if(response.statusText === "OK"){
            await axios.put("/erp/change_order_state", { invoice: 2, state: formik.values.order?.state, id: formik.values.order?._id });
            setAction("cancel");
            return toast.success("Invoice cancelled successfully.", { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Faield to cancel Invoice.", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <DialogBox
                visible={visible}
                setVisible={setVisible}
                header={"Payment"}
            >
                <PaymentForm 
                    setVisible={setVisible}
                    setAction={setAction}
                    invoiceData={{...formik.values, reference: reference, total: total, id: id, payment: payment, balance: amountDue}}
                />
            </DialogBox>
            <div>
                <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="btn-outlined px-4"
                            form="invoice-form"
                        >
                            {id ? "Edit" : "Save"}
                        </button>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">
                                Customer Invoice
                            </span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span>
                                    {id ? reference : "New"}
                                </span>
                                { id && <span>({formik.values.order.reference})</span> }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className='flex items-center justify-between mb-3'>
                        <div className='flex gap-2'>
                        {
                                state === 1 &&
                                <>
                                    {
                                        op === "financial" && payment !== 3 &&
                                        <button className='btn-primary p-2' onClick={() => setVisible(true)}>Payment</button>
                                    }
                                    {
                                        payment === 1 &&
                                        <button className='btn-gray' onClick={cancelInvoice}>Cancel</button>
                                    }
                                </>
                            }
                        </div>
                        {id && <StateStyle />}
                    </div>
                    <form
                        className="p-4 border grid gap-4 bg-white"
                        id="invoice-form"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='grid grid-cols-2 gap-10'>
                            <div className='flex flex-col gap-5'>
                                <div className="form-group">
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
                                            customers &&
                                            customers.map(customer => (
                                                <option value={customer._id} key={customer._id}>{customer.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
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
                                    <input 
                                        type="text" 
                                        name='journal'
                                        placeholder='e.g Customer Invoice'
                                        value={formik.values.journal}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                {
                                    op === "financial" && id == undefined &&
                                    <div className="form-group">
                                        <label
                                            htmlFor=""
                                            className={`${
                                                formik.touched.order &&
                                                formik.errors.order
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.order &&
                                            formik.errors.order
                                                ? formik.errors.order
                                                : "Customer Order (To Invoice)"}
                                        </label>
                                        <select
                                            name='order'
                                            value={formik.values.order}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="">-- select order --</option>
                                            {
                                                orders &&    
                                                orders.map(order => (
                                                    <option value={order._id} key={order._id}>{`${order.reference}, ₱${order.total}`}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                }
                            </div>
                            <div className='flex flex-col gap-5'>
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
                                            : "Journal"}
                                    </label>
                                    <input 
                                        type="date" 
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
                                            formik.touched.dueDate &&
                                            formik.errors.dueDate
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.dueDate &&
                                        formik.errors.dueDate
                                            ? formik.errors.dueDate
                                            : "Due Date"}
                                    </label>
                                    <input 
                                        type="date" 
                                        name='dueDate'
                                        value={formik.values.dueDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <span className='text-xl font-semibold'>Invoice Lines</span>
                            <div className='mt-4'>
                                <div className='mt-5'>
                                    <div className='grid grid-cols-[1fr_100px_100px_50px] gap-5 px-3 mb-2'>
                                        <span className='font-semibold text-gray-600'>Item</span>
                                        <span className='font-semibold text-gray-600'>Price</span>
                                        <span className='font-semibold text-gray-600'>Qty</span>
                                    </div>
                                    {
                                        formik.values.productOrder &&
                                        formik.values.productOrder.length !== 0 ?
                                        formik.values.productOrder.map(order => (
                                            <div key={order.productId} className='grid grid-cols-[1fr_100px_100px_50px] py-4 px-3 gap-5 bg-gray-100 border-x-0 border border-y-gray-300'>
                                                <span className='font-semibold'>{order.productName}</span>
                                                <span className='font-semibold'>{order.productPrice}</span>
                                                <span className='font-semibold'>{order.quantity}</span>
                                            </div>
                                        ))
                                        :
                                        <div className='bg-gray-100 border-x-0 border border-y-gray-300 mt-2'>
                                            <div className='font-semibold py-4 px-3'>No items yet</div>
                                        </div>
                                    }
                                </div>
                                <div className='mt-2 flex flex-col'>
                                    <div className='flex gap-2 items-center self-end font-semibold'>
                                        <span>Total:</span>
                                        <span className='text-xl'>{total} ₱</span>
                                    </div>
                                    {
                                        payment === 2 &&
                                        <>
                                            <div className='py-4 self-end'>  
                                                {
                                                    payments.map(pay => (
                                                        <div className='flex gap-2 items-center' key={pay._id}>
                                                            <span className="italic text-green-800">Paid on {moment(pay.date).format("L")}</span>
                                                            <span className='text-green-800'>{pay.amount} ₱</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className='flex gap-2 items-center self-end font-semibold'>
                                                <span>Amount Due:</span>
                                                <span className='text-xl'>{total - amountDue} ₱</span>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default InvoiceForm;