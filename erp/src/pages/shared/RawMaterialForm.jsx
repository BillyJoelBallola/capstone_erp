import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from 'moment';
import AdjustmentDialog from '../../components/AdjustmentDialog';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

const RawMaterialForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const location = op === "inventory" ? "inventory" : "supply-chain";
    const [data, setData] = useState({});
    const [forecasted, setForecasted] = useState(0);
    const [purchases, setPurchases] = useState([]);
    const [action, setAction] = useState("");
    const [visible, setVisible] = useState(false);
    const [storages, setStorages] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const random = `P-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}`;

    const formik = useFormik({
        initialValues: {
            _id: "",
            name: "",
            supplier: "",
            price: 0,
            quantity: 0,
            measurement: "",
            storage: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(4, "Item Name must be 4 characters or more.")
                .required("Item Name is required."),
            supplier: Yup.string()
                .required("Supplier is required"),
            price: Yup.number()
                .min(1, "Unit Price must be 1 Peso or more.")
                .required("Unit Price is required."),
            quantity: Yup.number()
                .min(0, "In Stock Quantity must be 1 or more."),
            measurement: Yup.string()
                .required("Unit of Measurement is required."),
            storage: Yup.string()
                .required("Storage is required.")
        }),
        onSubmit: async (values) => {
            if(id){
                const response = await axios.put("/erp/update_raw-material", values);
                if(response.statusText === "OK"){
                    return toast.success("Raw material edited successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to edit raw material.", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_raw-material", values);
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${location}/raw-materials/raw-material-form/${data._id}`);
                    return toast.success("Raw material added successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add raw material.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })

    useEffect(() => {
        if(purchases.length === 0){
            axios.get("/erp/purchases").then(({ data }) => {
                const targetMaterial = data.find(item => {
                    if(item.state === 2){
                        return item.materials.some(material => material.id === id);
                    }
                });
                const rawMaterials = targetMaterial?.materials?.map(raw => (raw));
                const mat = rawMaterials?.filter(raw => (raw.id === id));
                setForecasted(mat?.length > 0 ? mat[0]?.qty : 0);
                setPurchases(data);
            })
        }
    }, [purchases])

    useEffect(() => {
        const fetchData = async () => {
            const [storagesResponse, suppliersResponse] = await Promise.all([
                axios.get("/erp/storages"),
                axios.get("/erp/suppliers")
            ]);
            setStorages(storagesResponse.data);
            setSuppliers(suppliersResponse.data);
        };
        fetchData();
    }, [])

    useEffect(() => {   
        if(id){
            axios.get(`/erp/raw-material/${id}`).then(({ data }) => {
                formik.values._id = data._id;
                formik.values.name = data.name;
                formik.values.supplier = data.supplier._id;
                formik.values.price = data.price;
                formik.values.quantity = data.quantity;
                formik.values.measurement = data.measurement;
                formik.values.storage = data.storage;
                setData(data);
                setAction("");
            })
            axios.get(`/erp/adjustment/${id}`).then(({ data }) => {
                setAdjustments(data);
            })
        }
    }, [action])

    const replenish = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to create purchase order for this material?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                let duplicate = false;
        
                // purchases?.map(item => {
                //     if(item.supplier._id === formik.values.supplier && (item.state === 1 || item.state === 2)){
                //         duplicate = true;
                //     }
                // })
        
                if(duplicate){
                    return toast.error("Can't have a multiple purchase order for a supplier.", { position: toast.POSITION.TOP_RIGHT });
                }
        
                const response = await axios.post("/erp/replenish_purchase", { material: formik.values });
                if(response.statusText === "OK"){
                    setAction("replenish");
                    return toast.success("Purchase order successfully added.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add purchase order for this item.", { position: toast.POSITION.TOP_RIGHT });
                }           
            },
        });
    }

    return (
        <>
            <ToastContainer
                draggable={false}
                hideProgressBar={true}
            />
            <AdjustmentDialog
                visible={visible}
                setVisible={setVisible}
                itemData={data}
                setAction={setAction}
            />
            <ConfirmPopup />
            <div>
                <div className="fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className='flex items-center gap-3'>       
                
                        {
                            op === "inventory" ?
                            <>
                                <button type="submit" className="btn-outlined px-4" form="user-form">
                                    {id ? "Edit" : "Save"}
                                </button>
                                <div className="grid justify-center">
                                    <span className="text-lg font-semibold">Raw Material</span>
                                    <span className="text-sm font-semibold -mt-2">{id ? "Edit" : "New"}</span>
                                </div>
                            </>
                            : 
                            <div className='flex gap-1 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                <span className="text-lg font-semibold">Raw Materials</span>
                            </div>
                        }     
                    </div>
                    {
                        id && 
                        <div className='flex border border-gray-400 py-[1px] rounded-md text-xs'>
                            <NavLink to={`/${location}/material_forecast/${id}`} className='flex gap-1 items-center px-2 rounded-s-md hover:bg-gray-200'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <div className='grid text-left'>
                                    <span>Forecasted</span>
                                    <span className='-mt-1 font-semibold'>{formik.values.quantity + Number(forecasted)} Units</span>
                                </div>
                            </NavLink>
                            <div className='h-7 bg-gray-400 w-[1px]'/>
                            <button className='flex gap-1 items-center px-2 rounded-e-md hover:bg-gray-200'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                </div>
                                <div className='grid text-left'>
                                    <span>Purchased</span>
                                    <span className='-mt-1 font-semibold'>0 Units</span>
                                </div>
                            </button>
                        </div>
                    }
                    {   
                        id &&
                        <div className="flex gap-1">
                            <button className="btn-gray" onClick={replenish}>Replenish</button>
                            {
                                op === "inventory" &&
                                <button className="btn-gray" onClick={() => setVisible(true)}>Adjust</button>
                            }
                        </div>
                    }
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <form className="p-4 border grid gap-4 bg-white" id="user-form" onSubmit={formik.handleSubmit}>
                        <div className="flex justify-between">
                            <div className="form-group w-full">
                                <label htmlFor="" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                    {formik.touched.name && formik.errors.name ? formik.errors.name : "Item Name"}
                                </label>    
                                <input
                                    autoFocus
                                    type="text"
                                    style={{ fontSize: "larger", fontWeight: 600 }}
                                    placeholder="e.g. Chicken Meat"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                        <div className='mt-4'> 
                            <span className='text-2xl font-semibold'>Information</span>   
                            <div className='mt-4 grid gap-10 grid-cols-2'>
                                <div>
                                    <div className='grid gap-6'>
                                        <div className='form-group'>
                                            <label htmlFor="" className={`${formik.touched.supplier && formik.errors.supplier ? "text-red-400" : ""}`}>
                                                {formik.touched.supplier && formik.errors.supplier ? formik.errors.supplier : "Supplier"}
                                            </label>    
                                            <select 
                                                name="supplier"
                                                value={formik.values.supplier}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select supplier --</option>
                                                {
                                                    suppliers?.map((supplier) => (
                                                        <option value={supplier._id} key={supplier._id}>{supplier.business}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor="" className={`${formik.touched.price && formik.errors.price ? "text-red-400" : ""}`}>
                                                {formik.touched.price && formik.errors.price ? formik.errors.price : "Unit Price"}
                                            </label>    
                                            <input 
                                                type="number" 
                                                placeholder='₱ 0.00' 
                                                name='price'
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor="" className={`${formik.touched.quantity && formik.errors.quantity ? "text-red-400" : ""}`}>
                                                {formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : "In Stock Quantity (if applicable)"}
                                            </label>  
                                            <input 
                                                disabled={id ? true : false}
                                                type="number" 
                                                placeholder='0'
                                                name='quantity'
                                                value={formik.values.quantity}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='grid gap-6'>
                                        <div className='form-group'>
                                            <label htmlFor="" className={`${formik.touched.measurement && formik.errors.measurement ? "text-red-400" : ""}`}>
                                                {formik.touched.measurement && formik.errors.measurement ? formik.errors.measurement : "Unit of Measurement"}
                                            </label>  
                                            <input 
                                                type="text" 
                                                placeholder='e.g. Kilograms'
                                                name='measurement'
                                                value={formik.values.measurement}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor="" className={`${formik.touched.storage && formik.errors.storage ? "text-red-400" : ""}`}>
                                                {formik.touched.storage && formik.errors.storage ? formik.errors.storage : "Storage"}
                                            </label>  
                                            <select
                                                name='storage'
                                                value={formik.values.storage}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">-- select storage --</option>
                                                {
                                                    storages?.map((storage) => (
                                                        <option value={storage._id} key={storage._id}>{storage.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    {
                        id && 
                        <div className='grid gap-3'>
                            <div className='mt-4 text-sm'>
                                {`${moment(formik.values.date).format("LL")} - Raw Material Created.`}
                            </div>
                            {
                                adjustments?.length !== 0 &&
                                <>
                                    <div className='flex items-center gap-5'>
                                        <div className='h-[1px] w-full bg-gray-300'/>
                                        <span className='font-semibold text-gray-400'>Adjustments</span>
                                        <div className='h-[1px] w-full bg-gray-300'/>
                                    </div>
                                    <div className='grid gap-2'>
                                        {
                                            adjustments.map(adjustment => (
                                                <div className='text-sm' key={adjustment._id}>
                                                    <span className='font-semibold'>{adjustment.user}</span>
                                                    <div>{moment(adjustment.date).format("LL")} - {adjustment.remarks}</div>
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
    );
}

export default RawMaterialForm