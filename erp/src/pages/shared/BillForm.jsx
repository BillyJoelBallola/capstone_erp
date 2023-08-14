import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DialogBox from '../../components/DialogBox';
import { useFormik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import axios from "axios";

const referenceGenerator = (func) => {
    const [m, d, y] = moment(Date.now()).format("L").split("/");
    return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
}

const PaymentForm = ({ billData, setVisible, setAction }) => {
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
                send: true,
                receive: false
            },
            bank: "",
            date: "",
            memo: "",
            supplier: "",
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
            const response = await axios.post("/erp/add_payment", {...values, reference: referenceGenerator("SPAY"), bill: billData.id});
            if(response.statusText === "OK"){
                if(values.amount < amountDue){
                    await axios.put("/erp/change_bill_payment", { payment: 2, id: billData.id });
                }else{
                    await axios.put("/erp/change_bill_payment", { payment: 3, id: billData.id });
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
        if(billData){
            if(billData.payment === 2 && billData.balance){
                finalVal = billData.total - billData.balance;
            }else{
                finalVal = billData.total;
            }
            formik.values.supplier = billData.supplier;
            formik.values.amount = finalVal;
            formik.values.date = moment(Date.now()).format().toString().slice(0, 10);
            formik.values.memo = billData.reference;
            setAmountDue(finalVal);
        }
    }, [billData])

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

const BillForm = () => {
    const id = useParams().id;
    const purchaseId = useParams().purchase;
    const op = useParams().op;
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState(0);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const [reference, setReference] = useState("");
    const [action, setAction] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [payment, setPayment] = useState(0);
    const [payments, setPayments] = useState([]);
    const [amountDue, setAmountDue] = useState(0);

    useEffect(() => {
        if(!!payments){
            axios.get("/erp/payments").then(({ data }) => {
                const partial = data.filter(item => item.bill?._id === id && item.bill?.reference === reference && item.bill?.payment === 2);
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
            supplier: "",
            date: "",
            dueDate: "",
            journal: "",
            purchase: "",
            purchaseOrder: []
        },
        validationSchema: Yup.object({
            supplier: Yup.string()
                .required("Supplier is required."),
            date: Yup.date()
                .required("Bill Order is required."),
            dueDate: Yup.date()
                .required("Due Date is required."),
            journal: Yup.string()
                .min(4, "Journal must be 4 characters or more.")
                .required("Journal is required."),
        }),
        onSubmit: async (values) => {
            if(id){
                const response = await axios.put("/erp/update_bill", {...values, id: id});
                if(response.statusText === "OK"){
                    return toast.success("Edited successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Faield to edit.", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_bill", {...values, total: total, reference: referenceGenerator("BILL")});
                if(response.statusText === "OK"){
                    const id = purchaseId === undefined ? selectedOrderId : purchaseId;
                    await axios.put("/erp/change_purchase_state", { state: 5, id: id });
                    navigate(`/${op}/bills/bill-form/${id}/${response.data._id}`);
                    return toast.success("Purchase order successfully billed.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Faield to bill purchase order.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })

    useEffect(() => {
        if(suppliers.length === 0){
            axios.get("/erp/suppliers").then(({ data }) => {
                setSuppliers(data);
            })
        }
        if(purchaseOrders.length === 0){
            axios.get("/erp/purchases").then(({ data }) => {
                setPurchaseOrders(data);
            })
        }
    }, [suppliers, purchaseOrders])

    useEffect(() => {
        if(purchaseId !== undefined && id === undefined){
            axios.get(`/erp/purchase/${purchaseId}`).then(({ data }) => {
                formik.values.purchase = data._id;
                formik.values.supplier = data.supplier;
                formik.values.journal = "Supplier Bill";
                formik.values.date = moment(Date.now()).format().toString().slice(0, 10);
                formik.values.purchaseOrder = data.materials;
                setReference(data.reference);
                setTotal(data.total);
                setAction("");
            })
        }
        if(purchaseId !== undefined && id !== undefined){
            axios.get(`/erp/bill/${id}`).then(({ data }) => {
                formik.values.purchase = data.purchase;
                formik.values.supplier = data.supplier;
                formik.values.journal = data.journal;
                formik.values.date = data.date.toString().slice(0, 10);
                formik.values.dueDate = data.dueDate.toString().slice(0, 10);
                formik.values.purchaseOrder = data.purchaseOrder;
                setPayment(data.payment);
                setStatus(data.state);
                setReference(data.reference);
                setTotal(data.total);
                setAction("");
            })
        }
    }, [purchaseId, id, action])

    useEffect(() => {
        if(!id){
            if(formik.values.supplier !== ""){
                const waitingOrders = purchaseOrders.filter(order => order.supplier._id === formik.values.supplier && order.state === 3);
                setOrders(waitingOrders);
            }else{
                setOrders([]);
                formik.values.supplier = "";
                formik.values.purchaseOrder = [];
                formik.values.purchase = "";
            }
        }
    }, [formik.values.supplier])

    useEffect(() => {
        if(!id){
            if(formik.values.purchase !== ""){
                const orderMaterials = orders.find(order => {if(order._id === formik.values.purchase) return order});
                formik.values.purchaseOrder = orderMaterials?.materials;
                setSelectedOrderId(orderMaterials?._id);
                setTotal(orderMaterials?.total);
            }else{
                setSelectedOrderId("");
                formik.values.purchase = "";
                formik.values.purchaseOrder = [];
            }
        }
    }, [formik.values.purchase])

    const StateStyle = () => {
        return (
            <div className='flex items-center font-semibold text-sm'>
                { payment === 1 && <div className="text-red-600 border-red-400 bg-gray-200 border px-2 rounded-full z-10">Not Paid</div>}
                { payment === 2 && <div className="text-yellow-600 border-yellow-600 bg-gray-200 border px-2 rounded-full z-10">Partially Paid</div>}
                { payment === 3 && <div className="text-green-600 border-green-400 bg-gray-200 border px-2 rounded-full z-10">Paid</div>}
                <div className="flex justify-end">
                    <div className="max-w-min p-2 flex items-center justify-center gap-3 relative">
                        <div className="w-4/5 h-[2px] bg-gray-300 absolute"/>
                        <div className={`${status === 1 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Posted</div>
                        {
                            status === 2 &&
                            <div className={`text-blue-400 border-blue-400 bg-gray-200 border px-2 rounded-full z-10`}>Cancelled</div>
                        }
                    </div>
                </div>
            </div>
        )
    }    

    const cancelBill = async () => {
        const response = await axios.put("/erp/change_bill_state", { state: 2, id: id });
        if(response.statusText === "OK"){
            await axios.put("/erp/change_purchase_state", { state: 3, id: formik.values.purchase._id });
            toast.success("Bill cancelled successfully.", { position: toast.POSITION.TOP_RIGHT });
            setAction("cancel");
        }else{
            return toast.error("Faield to cancel bill.", { position: toast.POSITION.TOP_RIGHT });
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
                    billData={{...formik.values, reference: reference, total: total, id: id, payment: payment, balance: amountDue}}
                />
            </DialogBox>
            <div>
                <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="btn-outlined px-4"
                            form="bill-form"
                        >
                            {id ? "Edit" : "Save"}
                        </button>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">
                                Bill
                            </span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span>
                                    {id ? reference : "New"}
                                </span>
                                {   
                                    op === "supply-chain" && id && purchaseId && formik.values.purchase  &&
                                    <NavLink className="text-blue-400" to={`/supply-chain/purchases/purchase-form/${purchaseId}`}>{`(${formik.values.purchase.reference})`}</NavLink>
                                }
                                {
                                    op === "financial" && id &&
                                    <span>{`(${formik.values.purchase.reference})`}</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className='flex items-center justify-between mb-3'>
                        <div className='flex gap-2'>
                            {
                                status === 1 &&
                                <>
                                    {
                                        op === "financial" && payment !== 3 &&
                                        <button className='btn-primary p-2' onClick={() => setVisible(true)}>Payment</button>
                                    }
                                    {
                                        payment === 1 &&
                                        <button className='btn-gray' onClick={cancelBill}>Cancel</button>
                                    }
                                </>
                            }
                        </div>
                        {id && <StateStyle />}
                    </div>
                    <form
                        className="p-4 border grid gap-4 bg-white"
                        id="bill-form"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='grid grid-cols-2 gap-10'>
                            <div className='flex flex-col gap-5'>
                                <div className="form-group">
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
                                        disabled={purchaseId ? true : false}
                                        name="supplier"
                                        value={formik.values.supplier}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">-- select supplier --</option>
                                        {
                                            suppliers &&
                                            suppliers.map(sup => (
                                                <option value={sup._id} key={sup._id}>{sup.business}</option>
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
                                        placeholder='e.g. Supplier Bill' 
                                        name='journal'
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
                                                formik.touched.purchase &&
                                                formik.errors.purchase
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.purchase &&
                                            formik.errors.purchase
                                                ? formik.errors.purchase
                                                : "Purchase Order (Waiting bills)"}
                                        </label>
                                        <select
                                            name='purchase'
                                            value={formik.values.purchase}
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
                                            : "Bill Date"}
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
                                    <div className='grid grid-cols-[1fr_100px_100px_100px_50px] gap-5 px-3 mb-2'>
                                        <span className='font-semibold text-gray-600'>Item</span>
                                        <span className='font-semibold text-gray-600'>Measurement</span>
                                        <span className='font-semibold text-gray-600'>Price</span>
                                        <span className='font-semibold text-gray-600'>Qty</span>
                                    </div>
                                    {
                                        formik.values.purchaseOrder &&
                                        formik.values.purchaseOrder.length !== 0 ?
                                        formik.values.purchaseOrder.map(order => (
                                            <div key={order.id} className='grid grid-cols-[1fr_100px_100px_100px_50px] py-4 px-3 gap-5 bg-gray-100 border-x-0 border border-y-gray-300'>
                                                <span className='font-semibold'>{order.name}</span>
                                                <span className='font-semibold'>{order.uom}</span>
                                                <span className='font-semibold'>{order.price}</span>
                                                <span className='font-semibold'>{order.qty}</span>
                                            </div>
                                        ))
                                        :
                                        <div className='bg-gray-100 border-x-0 border border-y-gray-300 mt-2'>
                                            <div className='font-semibold py-4 px-3'>No items yet</div>
                                        </div>
                                    }
                                </div>
                                <div className='mt-8 flex flex-col'>
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

export default BillForm;