import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import moment from "moment";
import * as Yup from "yup";
import axios from 'axios';

const PayrollForm = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [reference, setReference] = useState("");
    const [payment, setPayment] = useState("");
    const [attendance, setAttendance] = useState("");
    const [attendanceDay, setAttendanceDay] = useState(0);
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
            const data = { id: id, employee: values.employee, reference: referenceGenerator("SLIP"), earning: values.earning ? values.earning : 0, gross: totals.gross, deduction: totals.deduction, netPay: totals.gross - totals.deduction }
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
                formik.values.earning = data.earning ? data.earning : "";
                setPayment(data.payment);
                setReference(data.reference);
            })
        }
    }, [id])

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
        if (formik.values.from && formik.values.to) {
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
    }, [employeeData.deductions, attendanceDay])

    useEffect(() => { 
        let totalDeduction = 0;
        if(formik.values.earning){
            employeeData.deductions.map(deduct => {
                totalDeduction += deduct.amount;
            })
            setTotals({
                gross: formik.values.earning,
                deduction: totalDeduction
            });
        }else{
            setTotals({
                gross: 0,
                deduction: 0
            })
        }
    }, [employeeData.deductions, formik.values.earning])

    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <div>
                <div className="fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
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
                        <div className='grid place-items-end font-semibold text-sm w-full'>
                            {
                                id &&
                                <>
                                    { payment === 1 && <div className="text-red-600 border-red-400 bg-gray-200 border px-2 rounded-full z-10">Not Paid</div>}
                                    { payment === 2 && <div className="text-yellow-600 border-yellow-600 bg-gray-200 border px-2 rounded-full z-10">Partially Paid</div>}
                                    { payment === 3 && <div className="text-green-600 border-green-400 bg-gray-200 border px-2 rounded-full z-10">Paid</div>}
                                </>
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
                                                    <span>Attendance (days): <b>{attendanceDay ? attendanceDay : "--"}</b></span>                                             <div className='grid grid-cols-2 gap-4'>   
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
                                <span className=''>Gross: ₱<b>{totals.gross ? totals.gross : "--"}</b></span>
                                <span className=''>Deduction: ₱<b>{totals.deduction ? totals.deduction : "--"}</b></span>
                                <span className='text-2xl font-semibold'>Net pay: ₱{totals.gross ? totals.gross - totals.deduction : "--"}</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PayrollForm;