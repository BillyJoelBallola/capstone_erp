import React, { useEffect, useState } from 'react';
import placeHolder from "../../assets/placeholder.png";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { country } from "../../static/country";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const EmployeeForm = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const [departments, setDepartment] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [selectedDeductions, setSelectedDeductions] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [deductionData, setDeductionData] = useState({
        id: "",
        name: "",
        amount: 0
    })

    useEffect(() => {
        axios.get("/erp/departments").then(({ data }) => {
            setDepartment(data);
        })
        axios.get("/erp/deductions").then(({ data }) => {
            setDeductions(data);
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            name: "",
            dob: "",
            age: "",
            gender: "",
            street: "",
            barangay: "",
            municipal: "",
            province: "",
            country: "",
            email: "",
            phoneNumber: "",
            contactName: "",
            contactPhoneNumber: "",
            department: "",
            salary: "",
            type: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(8, "Name must be 8 characters or more.")
                .required("Name is required."),
            dob: Yup.date()
                .required("Date of birth is required."),
            age: Yup.number()
                .required("Age is required."),
            gender: Yup.string()
                .required("Gender is required."),
            barangay: Yup.string()
                .required("Barangay is required."),
            municipal: Yup.string()
                .required("Municipal is required."),
            province: Yup.string()
                .required("Province is required."),
            country: Yup.string()
                .required("Country is required."),
            email: Yup.string()
                .email("Invalid email address."),
            phoneNumber: Yup.number()
                .min(11, "Phone Number must be 11 characters")
                .required("Phone Number is required."),
            contactName: Yup.string()
                .min(8, "Contact Name must be 8 characters or more.")
                .required("Name is required."),
            contactPhoneNumber: Yup.number()
                .min(11, "Phone Number must be 11 characters")
                .required("Phone Number is required."),
            department: Yup.string()
                .required("Department is required."),
            salary: Yup.number()
                .min(1, "Basic Salary must be 1 or more."),
            type: Yup.string()
                .required("Type is required.")
        }),
        onSubmit: async (values) => {
            const data = {
                name: values.name,
                dob: values.dob,
                age: values.age,
                gender: values.gender,
                department: values.department,
                salary: values.salary,
                deductions: selectedDeductions,
                address: { street: values.street, barangay: values.barangay, municipal: values.municipal, province: values.province, country: values.country },
                contact: { email:values.email, phoneNumber: values.phoneNumber },
                emergency: { name: values.contactName, phoneNumber: values.contactPhoneNumber },
                status: isActive,
                type: values.type
            }

            if(id){
                const response = await axios.put("/erp/update_employee", { _id: id, ...data });
                if(response.statusText === "OK"){
                    return toast.success("Employee updated successfully.", { position: toast.POSITION.TOP_RIGHT }); 
                }else{
                    return toast.error("Failed to update employee.", { position: toast.POSITION.TOP_RIGHT }); 
                }
            }else{
                const response = await axios.post("/erp/add_employee", data);
                if(response.statusText === "OK"){
                    navigate(`/human-resource/employees/employee-form/${response.data._id}`);
                    return toast.success("Employee added successfully.", { position: toast.POSITION.TOP_RIGHT }); 
                }else{
                    return toast.error("Failed to add employee.", { position: toast.POSITION.TOP_RIGHT }); 
                }
            }
        }
    })

    useEffect(() => {
        if(id){
            axios.get(`/erp/employee/${id}`).then(({ data }) => {
                formik.values.name = data.name;
                formik.values.department = data.department._id;
                formik.values.dob = data.dob.toString().slice(0, 10);
                formik.values.gender = data.gender;
                formik.values.age = data.age;
                formik.values.salary = data.salary ? data.salary : "";
                formik.values.type = data.type;
                formik.values.street = data?.address?.street;
                formik.values.barangay = data?.address?.barangay;
                formik.values.municipal = data?.address?.municipal;
                formik.values.province = data?.address?.province;
                formik.values.country = data?.address?.country;
                formik.values.phoneNumber = data?.contact?.phoneNumber;
                formik.values.email = data?.contact?.email;
                formik.values.contactName = data?.emergency?.name;
                formik.values.contactPhoneNumber = data?.emergency?.phoneNumber;
                setSelectedDeductions(data.deductions);
                setIsActive(data.status);
            })
        }
    }, [id])

    const resetDeduction = () => {
        setDeductionData({
            id: "",
            name: "",
            amount: 0
        })
    }

    const selectDeduction = (e) => {
        const id = e.target.value;
        const selected = deductions.find(item => id === item._id);
        setDeductionData({
            id: selected?._id,
            name: selected?.name,
            amount: selected?.amount
        })
    }

    const addDeduction = () => {
        if(deductionData.id === "") return toast.warning("Select deduction.", { position: toast.POSITION.TOP_RIGHT });

        let good = false;
        const duplicate = selectedDeductions.find(item => deductionData.id === item.id);

        if(duplicate){
            good = true;
        }
        if(good) {
            resetDeduction();
            return toast.error("Deduction already exist.", { position: toast.POSITION.TOP_RIGHT })
        };

        setSelectedDeductions(prev => [...prev, deductionData]);
        resetDeduction();
    }

    const removeDeduction = (idx) => {
        const deductionArray = [...selectedDeductions];
        deductionArray.splice(idx, 1);
        setSelectedDeductions(deductionArray);
    }

    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <div>
                <div className="fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className='flex items-center gap-3'>       
                        <div className='flex gap-2'>
                            <button type="submit" className="btn-outlined px-4" form="employee-form">
                                {id ? "Edit" : "Save"}
                            </button>
                            <div className="grid justify-center">
                                <span className="text-lg font-semibold">Employee</span>
                                <span className="text-sm font-semibold -mt-2">{id ? "Edit" : "New"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <form className="p-4 border grid gap-4 bg-white" id="employee-form" onSubmit={formik.handleSubmit}>
                    <div className="flex justify-between">
                            <div className="w-2/3 grid gap-4">
                                <div className="form-group">
                                    <label htmlFor="" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Name"}
                                    </label>    
                                    <input 
                                        autoFocus
                                        type="text" 
                                        name='name'
                                        placeholder='e.g John Doe'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{ fontSize: "larger", fontWeight: 600 }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className={`${formik.touched.department && formik.errors.department ? "text-red-400" : ""}`}>
                                        {formik.touched.department && formik.errors.department ? formik.errors.department : "Department"}
                                    </label>  
                                    <select
                                        name='department'
                                        value={formik.values.department}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">-- select department --</option>
                                        {
                                            departments?.map(pos => (
                                                <option value={pos._id} key={pos._id}>{pos.name}</option>
                                            ))
                                        }
                                    </select>
                                </div> 
                                <div className=" flex items-center gap-2 font-semibold">
                                    <input 
                                        type="checkbox" 
                                        className='cursor-pointer'
                                        checked={isActive}
                                        onChange={() => setIsActive(prev => !prev)}
                                    />
                                    <label htmlFor="">Active</label>
                                </div>
                            </div>
                            <div className="h-24 aspect-square border">
                                <img
                                    src={placeHolder}
                                    alt="user-image"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div className='mt-4 grid gap-8'>
                            <div className='grid'>
                                <span className='text-2xl font-semibold'>Personal Information</span>
                                <div className='mt-4 flex gap-10'>
                                    <div className='flex flex-col gap-4 w-full'>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.dob && formik.errors.dob ? "text-red-400" : ""}`}>
                                                {formik.touched.dob && formik.errors.dob ? formik.errors.dob : "Date of Birth"}
                                            </label>  
                                            <input 
                                                type="date" 
                                                name='dob'
                                                value={formik.values.dob}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.age && formik.errors.age ? "text-red-400" : ""}`}>
                                                {formik.touched.age && formik.errors.age ? formik.errors.age : "Age"}
                                            </label>  
                                            <input 
                                                type="number" 
                                                name='age'
                                                placeholder='Age'
                                                value={formik.values.age}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-4 w-full'>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.gender && formik.errors.gender ? "text-red-400" : ""}`}>
                                                {formik.touched.gender && formik.errors.gender ? formik.errors.gender : "Gender"}
                                            </label>  
                                            <select
                                                name='gender'
                                                value={formik.values.gender}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select gender --</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div> 
                                </div>
                                <div className='mt-4'>
                                    <span className='text-lg font-semibold'>Address</span>
                                    <div className='mt-4 flex gap-10'>
                                        <div className='flex flex-col gap-4 w-full'>
                                            <div className="form-group">
                                                <label htmlFor="" className={`${formik.touched.street && formik.errors.street ? "text-red-400" : ""}`}>
                                                    {formik.touched.street && formik.errors.street ? formik.errors.street : "Street"}
                                                </label>  
                                                <input 
                                                    type="text" 
                                                    name='street'
                                                    placeholder='Street'
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
                                                    name='barangay'
                                                    placeholder='Barangay'
                                                    value={formik.values.barangay}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className={`${formik.touched.municipal && formik.errors.municipal ? "text-red-400" : ""}`}>
                                                    {formik.touched.municipal && formik.errors.municipal ? formik.errors.municipal : "Municipal"}
                                                </label>  
                                                <input 
                                                    type="text" 
                                                    name='municipal'
                                                    placeholder='Municipal'
                                                    value={formik.values.municipal}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-4 w-full'>
                                            <div className="form-group">
                                                <label htmlFor="" className={`${formik.touched.province && formik.errors.province ? "text-red-400" : ""}`}>
                                                    {formik.touched.province && formik.errors.province ? formik.errors.province : "Province"}
                                                </label>  
                                                <input 
                                                    type="text" 
                                                    name='province'
                                                    placeholder='Province'
                                                    value={formik.values.province}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
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
                                                        country?.map((item, idx) => (
                                                            <option value={item} key={idx}>{item}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <span className='text-lg font-semibold'>Contact</span>
                                    <div className='mt-4 grid grid-cols-2 w-full gap-10'>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.phoneNumber && formik.errors.phoneNumber ? "text-red-400" : ""}`}>
                                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber : "Phone Number"}
                                            </label>  
                                            <input 
                                                type="text" 
                                                name='phoneNumber'
                                                placeholder='Phone Number'
                                                value={formik.values.phoneNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.email && formik.errors.email ? "text-red-400" : ""}`}>
                                                {formik.touched.email && formik.errors.email ? formik.errors.email : "Email"}
                                            </label>  
                                            <input 
                                                type="email" 
                                                name='email'
                                                placeholder='e.g micaella@gmail.com'
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <span className='text-lg font-semibold'>Emergency</span>
                                    <div className='mt-4 grid grid-cols-2 w-full gap-10'>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.contactName && formik.errors.contactName ? "text-red-400" : ""}`}>
                                                {formik.touched.contactName && formik.errors.contactName ? formik.errors.contactName : "Contact Name"}
                                            </label>  
                                            <input 
                                                type="text" 
                                                name='contactName'
                                                placeholder='e.g Juan Dela Cruz'
                                                value={formik.values.contactName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber ? "text-red-400" : ""}`}>
                                                {formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber ? formik.errors.contactPhoneNumber : "Contact Number"}
                                            </label>  
                                            <input 
                                                type="number" 
                                                name='contactPhoneNumber'
                                                placeholder='Phone Number'
                                                value={formik.values.contactPhoneNumber}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid '>
                                <span className='text-2xl font-semibold'>Work Information</span>
                                <div className='mt-4 grid grid-cols-2 gap-10'>
                                    <div className='flex flex-col gap-4'>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.type && formik.errors.type ? "text-red-400" : ""}`}>
                                                {formik.touched.type && formik.errors.type ? formik.errors.type : "Type"}
                                            </label>  
                                            <select 
                                                name="type"
                                                value={formik.values.type}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select type --</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Part Time">Part Time</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className={`${formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber ? "text-red-400" : ""}`}>
                                                {formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber ? formik.errors.contactPhoneNumber : "Basic Salary"}
                                            </label>  
                                            <input 
                                                type="number" 
                                                name='salary'
                                                placeholder='₱'
                                                value={formik.values.salary}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-4'>
                                        <div className="form-group">
                                            <label htmlFor="">Deduction</label>
                                            <div className='flex items-center gap-4 cursor-pointer'>
                                                <select
                                                    value={deductionData.id}
                                                    onChange={selectDeduction}
                                                >
                                                    <option value="">-- select deduction --</option>
                                                    {
                                                        deductions?.map(deduction => (
                                                            <option value={deduction._id} key={deduction._id}>{deduction.name} - ₱{deduction.amount}</option>
                                                        ))
                                                    }
                                                </select>
                                                <div className='btn-primary p-1 cursor-pointer' onClick={addDeduction}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>  
                                        <div className='bg-gray-100 border-x-0 border border-y-gray-300 p-3'>
                                            {
                                                selectedDeductions?.length !== 0 ?
                                                selectedDeductions?.map((deduction, idx) => (
                                                    <div className='grid grid-cols-[1fr_50px] gap-8 py-2' key={deduction.id}>
                                                        <div className='flex items-center justify-between'>
                                                            <span>{deduction.name}</span>
                                                            <span>₱{deduction.amount}</span>
                                                        </div>
                                                        <div className='cursor-pointer grid place-items-center' onClick={() => removeDeduction(idx)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    </div> 
                                                ))
                                                :
                                                <span>No items yet.</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EmployeeForm;