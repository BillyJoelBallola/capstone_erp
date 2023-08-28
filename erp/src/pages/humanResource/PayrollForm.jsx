import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import { formatMoney } from '../../static/_functions';
import DialogBox from '../../components/DialogBox';
import { useFormik } from 'formik';
import moment from "moment";
import * as Yup from "yup";
import axios from 'axios';

// TODO: Print slip

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

const PayrollForm = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [reference, setReference] = useState("");
    const [payment, setPayment] = useState("");
    const [state, setState] = useState("");
    const [action, setAction] = useState("");
    const [attendance, setAttendance] = useState("");
    const [attendanceDay, setAttendanceDay] = useState(0);
    const [paymentData, setPaymentData] = useState([]);
    const [date, setData] = useState("");
    const [employeeData, setEmployeeData] = useState({
       position: "",
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
                setPaymentData(data.paymentData);
                setData(data.date);
                setPayment(data.payment);
                setReference(data.reference);
                setState(data.state);
                setAction("");
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
                    setEmployeeData({
                        position: emp.position.name,
                        salary: emp.salary,
                        deductions: emp.deductions
                    })
                }
            });
        }else{
            setEmployeeData({
                position: "",
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
    }, [formik.values.from, formik.values.to, formik.values.employee, attendance]);

    useEffect(() => { 
        let totalDeduction = 0;
        if(employeeData.deductions && attendanceDay){
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
    }, [employeeData.deductions, attendanceDay])

    useEffect(() => { 
        let totalDeduction = 0;
        if(formik.values.earning !== 0){
            employeeData.deductions.map(deduct => {
                totalDeduction += deduct.amount;
            })
            setTotals({
                gross: formik.values.earning,
                deduction: totalDeduction
            });
        }

        if(formik.values.earning === 0 && id !== undefined){
            setTotals({
                gross: 0,
                deduction: 0
            }) 
        }
        
    }, [employeeData.deductions, formik.values.earning, id])

    const cancelSlip = async () => {
        const data = {id: id, state: 2};

        const response = await axios.put("/erp/change_payslip_status", data)
        if(response.statusText === "OK"){
            setAction("cancelled"); 
            return toast.success("Payslip has been cancelled.", { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Failed to cancel payslip.", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    return (
        <>
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
                                    { payment === 1 && <button className='btn-dark-gray p-2' onClick={cancelSlip}>Cancel</button>}
                                    { payment === 3 && <button className='btn-dark-gray px-4 py-2 whitespace-nowrap'>Print Slip</button>}
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
                                <label htmlFor="">Position</label>
                                <span className='text-lg font-semibold'>{employeeData.position ? employeeData.position : "--"}</span>
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
                                                    <span>Attendance (days): <b>{attendanceDay}</b></span>                                             <div className='grid grid-cols-2 gap-4'>   
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
                                <span className=''>Deduction: ₱<b>{formatMoney(totals.deduction ? totals.deduction : 0)}</b></span>
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

export default PayrollForm;