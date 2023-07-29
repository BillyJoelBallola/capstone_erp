import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import axios from "axios";

const PurchaseForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const [bill, setBill] = useState({});
    const [reference, setReference] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [action, setAction] = useState("");
    const [state, setState] = useState(0);
    const [materials, setMaterials] = useState({
        id: "",
        name: "",
        qty: "",
        uom: "",
        price: ""
    });
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    const formik = useFormik({
        initialValues: {
            supplier: "",
            date: "",
            expectedArrival: "",
            materials: [],
            automate: false
        },
        validationSchema: Yup.object({
            supplier: Yup.string()
                .required("Supplier is required."),
            date: Yup.date()
                .required("Order Date is required."),
            expectedArrival: Yup.date()
                .min(moment(yesterday).format(), "Expected Arrival date must be either today or a future date.")
                .required("Expcted Arrival date is required.")
        }),
        onSubmit: async (values) => {
            if(id){
                const response = await axios.put("/erp/update_purchase", { _id: id, supplier: values.supplier, date: values.date, expectedArrival: values.expectedArrival, materials: values.materials, total: totalPrice, state: state, automate: values.automate, reference: referenceGenerator("PRS") });
                if(response.statusText === "OK"){
                    return toast.success("Edited Successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to edit.", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_purchase", {supplier: values.supplier, date: values.date, expectedArrival: values.expectedArrival, materials: values.materials, total: totalPrice, state: values.state, automate: values.automate, reference: referenceGenerator("PRS") });
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${op}/purchases/purchase-form/${data._id}`);
                    return toast.success("Added Successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    });

    useEffect(() => {
        if(id){
            axios.get(`/erp/purchased_bill/${id}`).then(({ data }) => {
                setBill(data);
            })
        }
    }, [id])

    useEffect(() => {
        if(id){
            axios.get(`/erp/purchase/${id}`).then(({ data }) => {
                formik.values.supplier = data.supplier;
                formik.values.date = data.date.toString().slice(0, 10);
                formik.values.expectedArrival = data.expectedArrival.toString().slice(0, 10);
                formik.values.materials = data.materials;
                formik.values.automate = data.automate;
                setReference(data.reference);
                setState(data.state);
                setTotalPrice(data.total);
                setAction("");
            })
        }
    }, [id, action])
    
    useEffect(() => {
        axios.get("/erp/suppliers").then(({ data }) => {
            setSuppliers(data);
        })
        axios.get("/erp/raw-materials").then(({ data }) => {
            setRawMaterials(data);
        })
    }, [])

    useEffect(() => {   
        const item = rawMaterials.filter(item => (item._id === materials.id))
        setMaterials(prev => ({
            ...prev,
            id: item[0]?._id,
            name: item[0]?.name,
            uom: item[0]?.measurement
        }));
    }, [materials.id])

    const resetMaterials = () => {
        setMaterials({
            id: "",
            name: "",
            qty: "",
            uom: "",
            price: ""
        })
    }
    
    const addItem = () => {
        if(materials.id === "" || materials.qty === "" || materials.price === ""){
            return toast.warning("Fill up all fields of items.", { position: toast.POSITION.TOP_RIGHT });
        }

        if( materials.qty <= 0){
            return toast.warning("Quatity must be 1 or more.", { position: toast.POSITION.TOP_RIGHT });
        }

        const duplicateItem = formik.values.materials.filter((item) => (materials.id === item.id));
        if(duplicateItem.length >= 1){
            resetMaterials();
            return toast.error("Failed to add item that already exist in the list.", { position: toast.POSITION.TOP_RIGHT });
        }

        setTotalPrice(prev => prev + (Number(materials.price) * materials.qty));
        formik.values.materials.push(materials);
        resetMaterials();
    }
    
    const addEditItem = () => {
        if(materials.id === "" || materials.qty === "" || materials.price === ""){
            return toast.warning("Fill up all fields of items.", { position: toast.POSITION.TOP_RIGHT });
        }

        if(materials.qty <= 0){
            return toast.warning("Quatity must be 1 or more.", { position: toast.POSITION.TOP_RIGHT });
        }

        formik.values.materials.splice(materials.idx, materials.idx + 1, materials);
        resetMaterials();
    }

    const removeItem = (idx) => {
        const newRawMaterialData = [...formik.values.materials];
        const matsData = formik.values.materials[idx];
        setTotalPrice(prev => prev - Number(matsData.price));
        newRawMaterialData.splice(idx, 1);
        formik.values.materials = newRawMaterialData;
        resetMaterials();
    }

    const RawMats = () => {
        const mats = rawMaterials.filter(item => (item.supplier._id === formik.values.supplier));

        return (
            <>
            <option value="">-- select item --</option>
                {
                    mats?.map((rawMat) => (
                        <option value={rawMat._id} key={rawMat._id}>{rawMat.name}</option>
                    ))
                }
            </>
        ) 
    } 

    const selectMats = (idx) => {
        const rawMats = formik.values.materials[idx];
        if(rawMats !== undefined){
            setMaterials({
                idx: idx,
                id: rawMats.id,
                name: rawMats.name,
                qty: rawMats.qty,
                uom: rawMats.uom,
                price: rawMats.price
            })
        }
    }

    const StateStyle = () => {
        return (
            <div className="flex justify-end">
                <div className="max-w-min p-2 font-semibold text-sm flex items-center justify-center gap-3 relative">
                    <div className="w-4/5 h-[2px] bg-gray-300 absolute"/>
                    <div className={`${state === 1 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Pending</div>
                    <div className={`${state === 2 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Confirm</div>
                    <div className={`${state === 3 || state === 5 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Done</div>
                    {
                        state === 4 &&
                        <div className={`${state === 4 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Cancelled</div>
                    }
                </div>
            </div>
        )
    }

    const purchaseOrderState = async (state) => {
        let successMsg = "";
        let errorMsg = "";

        switch(state){
            case 2:
                successMsg = "Purchase order confirm successfully.";
                errorMsg = "Failed to confirm purchase order.";
                break; 
            case 3: 
            successMsg = "Purchase order is set to finished successfully.";
                errorMsg = "Failed to set to finish purchase order.";
                break; 
            case 4: 
                successMsg = "Purchase order cancelled successfully.";
                errorMsg = "Failed to cancel purchase order.";
                break; 
        }

        const response = await axios.put("/erp/change_purchase_state", { state: state, id: id });
        if(response.statusText === "OK"){
            setAction("change");
            return toast.success(successMsg, { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
        }
    }

    return (
        <>
            <ToastContainer draggable={false} hideProgressBar={true} />
            <div>
                <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="btn-outlined px-4"
                            form="purchase-form"
                        >
                            {id ? "Edit" : "Save"}
                        </button>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">
                                Purchase
                            </span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span className="">
                                    {id ? reference : "New"}
                                </span>
                                {
                                    bill && state === 5 &&
                                    <NavLink className="text-green-500 italic" to={`/supply-chain/bills/bill-form/${id}/${bill[0]?._id}`}>View Bill</NavLink>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {
                                op !== "inventory" &&
                                (state === 1 || state === 2 || state === 3)  && 
                                <button 
                                    className={`${state === 2 || state === 3 ? "btn-primary p-2" : "btn-gray"}`} 
                                    onClick={() => 
                                        state === 1 ? 
                                        purchaseOrderState(2) : 
                                        state === 2 ? 
                                        purchaseOrderState(3) : 
                                        state === 3 ?
                                        navigate(`/supply-chain/bills/bill-form/${id}`)
                                        : null }
                                >
                                    {state === 1 ?
                                    "Confirm Order" : 
                                    state === 2 ?
                                    "Receive All" : 
                                    state === 3 ? 
                                    "Create Bill" : ""}
                                </button>
                            }
                            {
                                op !== "inventory" &&
                                (state === 1 || state === 2) &&
                                <button 
                                    className="btn-gray" 
                                    onClick={() => purchaseOrderState(4)}
                                >
                                    Cancel
                                </button>
                            }
                        </div>
                        { id && <StateStyle /> }
                    </div>
                    <form
                        className="p-4 border grid gap-4 bg-white"
                        id="purchase-form"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-4">
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
                                        disabled={state >= 3 ? true : false}
                                        autoFocus
                                        name="supplier"
                                        value={formik.values.supplier}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">
                                            -- select supplier --
                                        </option>
                                        {suppliers?.map((item) => (
                                            <option
                                                value={item._id}
                                                key={item._id}
                                            >
                                                {item.business}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-10">
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
                                            : "Order Date"}
                                    </label>
                                    <input
                                        disabled={state >= 3 ? true : false}
                                        type="date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.expectedArrival &&
                                            formik.errors.expectedArrival
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.expectedArrival &&
                                        formik.errors.expectedArrival
                                            ? formik.errors.expectedArrival
                                            : "Expected Arrival"}
                                    </label>
                                    <input
                                        disabled={state >= 3 ? true : false}
                                        type="date"
                                        name="expectedArrival"
                                        value={formik.values.expectedArrival}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl my-4">Materials</div>
                            <div className='mb-4 grid grid-cols-[1fr_100px_100px_100px_80px] items-center gap-10'>
                                <span className='font-semibold text-gray-600'>Item</span>    
                                <span className='font-semibold text-gray-600'>Measurement</span>        
                                <span className='font-semibold text-gray-600'>Price</span>        
                                <span className='font-semibold text-gray-600'># Qty</span>        
                            </div>
                            {
                               state < 3 &&
                                <div className='grid grid-cols-[1fr_100px_100px_100px_80px] items-center gap-10'>
                                    <select 
                                        className='w-full min-w-32'
                                        value={materials.id}
                                        onChange={(e) => setMaterials((prev) => ({ ...prev, id: e.target.value }))}
                                    >
                                    <RawMats />
                                    </select>
                                    <span className='font-semibold'>{materials.uom ? materials.uom : "--"}</span>
                                    <input 
                                        type="number"  
                                        placeholder='0.00'
                                        value={materials.price}
                                        onChange={(e) => setMaterials(prev => ({...prev, price: e.target.value }))}
                                    />
                                    <input 
                                        type="number"  
                                        placeholder='0'
                                        value={materials.qty}
                                        onChange={(e) => setMaterials(prev => ({...prev, qty: e.target.value }))}
                                    />
                                    <div className="flex gap-1 items-center justify-center">
                                        <div className='btn-primary max-w-min p-1 cursor-pointer' onClick={materials.idx >= 0 ? addEditItem : addItem}>
                                            {
                                                materials.idx >= 0 ? 
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            }
                                        </div>
                                        {
                                            materials.idx >= 0 &&
                                            <div className='btn-primary max-w-min p-1 cursor-pointer' onClick={resetMaterials}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                            
                            <div className='mt-4'>
                                <div className='bg-gray-100 border-x-0 border border-y-gray-300'>
                                    {   
                                        formik.values.materials?.length > 0 ?
                                        formik.values.materials?.map((item, idx) => (
                                            <div key={item.id} className={`hover:bg-gray-300 py-4 px-3 grid grid-cols-[1fr_100px_100px_100px_50px] items-center gap-10 cursor-pointer ${materials.idx === idx ? "bg-gray-300" : ""}`} onClick={() => selectMats(idx)}>
                                                <span className='font-semibold'>{item.name}</span>
                                                <span className='font-semibold'>{item.uom}</span>
                                                <span className='font-semibold'>{item.price}</span>
                                                <span className='font-semibold'>{item.qty}</span>
                                                {
                                                   state < 3 && 
                                                    <div className='cursor-pointer max-w-min' onClick={() => removeItem(idx)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                }
                                            </div>
                                        ))
                                        :
                                        <div className='font-semibold py-4 px-3'>No items yet</div>
                                    }
                                </div>
                                <div className="flex justify-end py-6">
                                    <div className="flex gap-2 text-lg py-2 px-3 pr-64 font-semibold border-0 border-t-[1px] border-t-gray-300">
                                        <span>Total:</span>
                                        <span>₱{totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PurchaseForm;
