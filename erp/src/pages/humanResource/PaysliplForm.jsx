import React, { useContext, useEffect, useState, useRef } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import { formatMoney } from '../../static/_functions';
import DialogBox from '../../components/DialogBox';
import logo from "../../assets/micaella-logo.png";
import { useReactToPrint } from 'react-to-print';
import { useFormik } from 'formik';
import moment from "moment";
import * as Yup from "yup";
import axios from 'axios';

const PaySlipPreview = ({ setPreview, data, totals, reference }) => {
    const previewRef = useRef(null);

    const printSlip = useReactToPrint({
        content: () => previewRef.current
    });

    return (
        <div className='absolute z-40 bg-black/80 inset-0 py-20'>
            <div className='max-w-[70%] mx-auto'>
                <div className="mb-2 flex justify-between">
                    <div className='flex gap-3 items-center'>
                        <button onClick={() => setPreview(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#fff" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <span className='text-lg font-semibold text-white'>Preview</span>
                    </div>
                    <div className='text-white flex gap-3'>
                        <button onClick={printSlip}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6" ref={previewRef}>
                    <div className="py-2 border border-x-0 border-t-0 border-gray-400">
                        <div className="flex w-32">
                            <img src={logo} alt="logo" className='object-fit'/>
                        </div>
                    </div>
                    <div className='py-2 grid gap-10'>
                        <div className='flex justify-between'>
                            <div className='grid'>
                                <span>{data.name}</span>
                                <span>{data.department.name}</span>
                            </div>
                            <div>
                                <span>Period: <b>{moment(data.from).format("ll")} - {moment(data.to).format("ll")}</b></span>
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-semibold">{reference}</span>
                            <div></div>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentForm = ({ netPay, visible, setVisible, setAction }) => {
    const id = useParams().id;
    const { currentUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            amount: "",
            date: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .min(netPay, "Amount can't be less than to net pay")
                .required("Amount is required"),
            date: Yup.date()
                .required("Payment Date is required")
        }),
        onSubmit: async (values, helpers) => {
            const response = await axios.put("/erp/change_payslip_payment", {...values, user: currentUser.email, id: id, payment: 3});
            if(response.statusText === "OK"){
                setAction("pay"); 
                setVisible(false);
                helpers.resetForm();
                return toast.success("Payment successfully.", { position: toast.POSITION.TOP_RIGHT });
            }else{
                setVisible(false);
                helpers.resetForm();
                return toast.error("Failed to cancel payslip.", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    useEffect(() => {
        if(netPay){
            formik.values.amount = netPay;
            formik.values.date = moment(Date.now()).format().toString().slice(0, 10);
        }
    }, [netPay])

    return (
        <DialogBox
            header={"Payment"}
            visible={visible}
            setVisible={setVisible}
            w={"60vw"}
        >
            <form className='flex flex-col gap-4' onSubmit={formik.handleSubmit}>
                <div className='grid grid-cols-2 gap-4'>
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
                                : "₱Amount"}
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
                </div>
                {/* <span>{formik.values.amount < netPay && `Payment Difference: ${ netPay - formik.values.amount }`}</span> */}
                <div className='self-end'>
                    <button className='btn-primary px-4 py-2 max-w-min' type='submit'>Payment</button>
                </div>
            </form>
        </DialogBox>
    )
}

const PaysliplForm = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [visible, setVisible] = useState(false);
    const [preview, setPreview] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [reference, setReference] = useState("");
    const [payment, setPayment] = useState("");
    const [state, setState] = useState("");
    const [action, setAction] = useState("");
    const [attendance, setAttendance] = useState("");
    const [attendanceDay, setAttendanceDay] = useState(0);
    const [paymentData, setPaymentData] = useState([]);
    const [employee, setEmployee] = useState("");
    const [date, setDate] = useState("");
    const [employeeData, setEmployeeData] = useState({
        department: "",
        deductions: [],
        salary: 0
    });
    const [totals, setTotals] = useState({
        gross: 0,
        deduction: 0
    })

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    const earningValidation = {
        employee: Yup.string()
            .required("Employee is required"),
        earning: Yup.number()
            .required("Earning is required.")
    }
    
    const attendanceValidation = {
        employee: Yup.string()
            .required("Employee is required"),
        from: Yup.date()
            .required("Date: From is required"),
        to: Yup.date()
            .required("Date: To is required"),
    }

    const formik = useFormik({
        initialValues: {
            employee: "",
            earning: "",
            from: "",
            to: ""
        },
        validationSchema: Yup.object(employeeData.salary ? attendanceValidation : earningValidation),
        onSubmit: async (values) => {
            const data = { id: id, employee: values.employee, reference: referenceGenerator("SLIP"), toDate: values.to, fromDate: values.from, earning: values.earning ? values.earning : 0, gross: totals.gross, deduction: totals.deduction, netPay: totals.gross - totals.deduction }
            if(id){
                const response = await axios.put("/erp/update_payslip", data);
                if(response.statusText === "OK"){
                    return toast.success("Payslip edited successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to edit payslip.", { position: toast.POSITION.TOP_RIGHT });
                } 
            }else{
                const response = await axios.post("/erp/add_payslip", data);
                if(response.statusText === "OK"){
                    navigate(`/human-resource/payrolls/payroll-form/${response.data._id}`);
                    return toast.success("Payslip added successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add payslip.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })

    useEffect(() => {
        if(id){
            axios.get(`/erp/payslip/${id}`).then(({ data }) => {
                formik.values.employee = data.employee;
                formik.values.from = data.fromDate ? data.fromDate.toString().slice(0, 10) : "";
                formik.values.to = data.toDate ? data.toDate.toString().slice(0, 10) : "";
                formik.values.earning = data.earning;
                setEmployee(data.employee);
                setPaymentData(data.paymentData);
                setDate(data.date);
                setPayment(data.payment);
                setReference(data.reference);
                setState(data.state);
                setAction("");
                setTotals({
                    gross: data.gross,
                    deduction: data.deduction
                });
            })
        }
    }, [id, action]);

    useEffect(() => {   
        axios.get("/erp/employees").then(({ data }) => {
            setEmployees(data.filter(emp => emp.status === true));
        });
        axios.get("/erp/attendance").then(({ data }) => {
            setAttendance(data);
        });
    }, [])

    useEffect(() => {
        if(formik.values.employee){
            employees.find(emp => {
                if(formik.values.employee === emp._id){
                    setData(emp);
                    setEmployeeData({
                        department: emp.department.name,
                        salary: emp.salary,
                        deductions: emp.deductions
                    })
                }
            });
        }else{
            setEmployeeData({
                department: "",
                salary: "",
                deductions: []
            })
            setTotals({
                gross: 0,
                deduction: 0,
            })
            formik.resetForm();
        }
    }, [formik.values.employee, employees])

    useEffect(() => {
        if(employeeData.salary !== null){
            if (formik.values.from !== "" && formik.values.to !== "" && attendance) {
                const attendanceData = attendance.filter(attend => 
                    attend.employee.toString() === formik.values.employee &&
                    attend.timeOut >= formik.values.from && 
                    attend.timeOut <= formik.values.to 
                );
                setAttendanceDay(attendanceData.length);
            } else {
                setAttendanceDay(0);
            }
        }
    }, [formik.values.from, formik.values.to, formik.values.employee, attendance]);

    useEffect(() => { 
        let totalDeduction = 0;
        if(employeeData.salary !== null){
            if(employeeData.deductions && attendanceDay !== 0){
                employeeData.deductions.map(deduct => {
                    totalDeduction += deduct.amount;
                })
                setTotals({
                    gross: employeeData.salary * attendanceDay,
                    deduction: totalDeduction
                });
            }
    
            if(attendanceDay === 0){
                setTotals({
                    gross: 0,
                    deduction: 0
                })
            }
        }
    }, [employeeData.deductions, attendanceDay])

    useEffect(() => { 
        let totalDeduction = 0;
        if(employeeData.salary === null){
            if(formik.values.earning !== 0){
                employeeData.deductions.map(deduct => {
                    totalDeduction += deduct.amount;
                })
                setTotals({
                    gross: formik.values.earning,
                    deduction: totalDeduction
                });
            }
        
            if(formik.values.earning === 0){
                setTotals({
                    gross: 0,
                    deduction: 0
                }) 
            }
        }
    }, [employeeData.deductions, formik.values.earning, id])

    const cancelSlip = (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Do you want to delete this record?',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                const data = {id: id, state: 2};

                const response = await axios.put("/erp/change_payslip_status", data)
                if(response.statusText === "OK"){
                    setAction("cancelled"); 
                    return toast.success("Payslip has been cancelled.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to cancel payslip.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        });
    }

    return (
        <>
            {
                preview &&   
                <PaySlipPreview 
                    data={{...data, from: formik.values.from, to: formik.values.to}}
                    setPreview={setPreview}
                    totals={totals}
                    reference={reference}
                />
            }
            <ConfirmPopup />
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <PaymentForm 
                visible={visible}
                setVisible={setVisible}
                setAction={setAction}
                netPay={totals.gross - totals.deduction}
            />
            <div>
                <div className="fixed z-20 left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className='flex items-center gap-3'>       
                        <button type="submit" className="btn-outlined px-4" form="payslip-form">
                            {id ? "Edit" : "Save"}
                        </button>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">Payslip</span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span className="">
                                    {id ? reference : "New"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32">
                    <div className='flex items-center justify-between mb-3'>
                        <div className='flex gap-2'>
                            {
                                id && state === 1 &&
                                <>
                                    { payment <= 2 && <button className='btn-primary p-2' onClick={() => setVisible(true)}>Payment</button>}
                                    { <button className='btn-dark-gray px-4 py-2' onClick={() => setPreview(true)}>Preview</button> }
                                    { payment === 1 && <button className='btn-dark-gray p-2' onClick={cancelSlip}>Cancel</button>}
                                </>
                            }
                        </div>
                        <div className='grid place-items-end font-semibold text-sm w-full'>
                            {
                                id &&
                                <div className='flex gap-2'>
                                    { payment === 1 && <div className="text-red-600 border-red-400 bg-gray-200 border px-2 rounded-full z-10">Not Paid</div>}
                                    { payment === 2 && <div className="text-yellow-600 border-yellow-600 bg-gray-200 border px-2 rounded-full z-10">Partially Paid</div>}
                                    { payment === 3 && <div className="text-green-600 border-green-400 bg-gray-200 border px-2 rounded-full z-10">Paid</div>}
                                    { state === 2 && <div className="text-blue-400 border-blue-400 bg-gray-200 border px-2 rounded-full z-10">Cancelled</div>}
                                </div>
                            }
                        </div>
                    </div>
                    <form className="p-4 border grid gap-4 bg-white" id="payslip-form" onSubmit={formik.handleSubmit}>
                        <div className='grid gap-4'>
                            <div className="form-group">
                                <label htmlFor="" className={`${formik.touched.employee && formik.errors.employee ? "text-red-400" : ""}`}>
                                    {formik.touched.employee && formik.errors.employee ? formik.errors.employee : "Employee"}
                                </label>    
                                <select
                                    disabled={id ? true : false}
                                    name='employee'
                                    value={formik.values.employee}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">-- select employee --</option>
                                    {
                                        employees?.map(employee => (
                                            <option value={employee._id} key={employee._id}>{employee.name}</option>
                                        ))

                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Department</label>
                                <span className='text-lg font-semibold'>{employeeData.department ? employeeData.department : "--"}</span>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <div className='grid'>
                                <span className='text-2xl font-semibold'>Salary Information</span>
                                <div className='mt-4 grid grid-cols-2 gap-10'>
                                    <div className='flex flex-col gap-4'>
                                        {
                                            employeeData?.salary ?
                                            <>
                                                <div className="grid gap-1">
                                                    <span>Base Salary</span>
                                                    <span className='text-xl font-semibold'>₱{employeeData?.salary}</span>
                                                </div>
                                                <div className='grid gap-2'>
                                                    <span>Attendance (days): <b>{attendanceDay}</b></span>                                             
                                                    <div className='grid grid-cols-2 gap-4'>   
                                                        <div className="form-group">
                                                            <label htmlFor="" className={`${formik.touched.from && formik.errors.from ? "text-red-400" : ""}`}>
                                                                {formik.touched.from && formik.errors.from ? formik.errors.from : "From"}
                                                            </label>   
                                                            <input 
                                                                type="date" 
                                                                name='from'
                                                                value={formik.values.from}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="" className={`${formik.touched.to && formik.errors.to ? "text-red-400" : ""}`}>
                                                                {formik.touched.to && formik.errors.to ? formik.errors.to : "To"}
                                                            </label>   
                                                            <input 
                                                                type="date" 
                                                                name='to'
                                                                value={formik.values.to}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </> :
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="" className={`${formik.touched.earning && formik.errors.earning ? "text-red-400" : ""}`}>
                                                        {formik.touched.earning && formik.errors.earning ? formik.errors.earning : "Earning"}
                                                    </label>   
                                                    <input 
                                                        type="number"
                                                        name='earning'
                                                        placeholder='₱'
                                                        value={formik.values.earning}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur} 
                                                    />
                                                </div>  
                                                <div className='grid gap-2'>                                          
                                                    <div className='grid grid-cols-2 gap-4'>   
                                                        <div className="form-group">
                                                            <label htmlFor="" className={`${formik.touched.from && formik.errors.from ? "text-red-400" : ""}`}>
                                                                {formik.touched.from && formik.errors.from ? formik.errors.from : "From"}
                                                            </label>   
                                                            <input 
                                                                type="date" 
                                                                name='from'
                                                                value={formik.values.from}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="" className={`${formik.touched.to && formik.errors.to ? "text-red-400" : ""}`}>
                                                                {formik.touched.to && formik.errors.to ? formik.errors.to : "To"}
                                                            </label>   
                                                            <input 
                                                                type="date" 
                                                                name='to'
                                                                value={formik.values.to}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div>
                                        <div className='grid gap-1'>
                                            <span>Deductions</span>
                                            <div className='bg-gray-100 border-x-0 border border-y-gray-300 p-2'>
                                                {
                                                    employeeData?.deductions?.length !== 0 ?
                                                    employeeData?.deductions?.map((deduct, idx) => (
                                                        <div className='grid grid-cols-[1fr_50px] gap-5' key={idx}>
                                                            <span>{deduct.name}</span>
                                                            <span>₱{deduct.amount}</span>
                                                        </div>
                                                    )) :
                                                    <div>
                                                        <span>No items yet.</span>
                                                    </div>
                                                }
                                            </div>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                            <div className='mt-12 grid place-items-end'>
                                <span className=''>Gross: <b>{formatMoney(totals.gross ? totals.gross : 0)}</b></span>
                                <span className=''>Deduction: <b>{formatMoney(totals.deduction ? totals.deduction : 0)}</b></span>
                                <span className='text-2xl font-semibold'>Net pay: {formatMoney(totals.gross ? totals.gross - totals.deduction : 0)}</span>
                            </div>
                        </div>
                    </form>
                    {
                        id && 
                        <div className='grid gap-3'>
                            <div className='mt-4 text-sm'>
                                {`${moment(date).format("LL")} - Payslip Created.`}
                            </div>
                            {
                                paymentData?.length !== 0 && paymentData !== null &&
                                <>
                                    <div className='flex items-center gap-5'>
                                        <div className='h-[1px] w-full bg-gray-300'/>
                                        <span className='font-semibold text-gray-400'>Payments</span>
                                        <div className='h-[1px] w-full bg-gray-300'/>
                                    </div>
                                    <div className='grid gap-2'>
                                        {
                                            paymentData.map((payment, idx) => (
                                                <div className='text-sm' key={idx}>
                                                    <span className='font-semibold'>{payment.user}</span>
                                                    <div>{moment(payment.date).format("LL")} - Payment</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default PaysliplForm;