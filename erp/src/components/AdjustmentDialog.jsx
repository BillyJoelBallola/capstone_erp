import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AdjustmentDialog = ({ visible, setVisible, itemData, setAction }) => {
    const { currentUser } = useContext(UserContext);
    const path = useLocation().pathname.split("/");

    useEffect(() => {
        if(itemData){
            if(path.includes("products" || "product")){
                formik.values.quantity = itemData.length > 0 ? itemData[0]?.quantity : itemData.quantity;
                formik.values.storage  = itemData.length > 0 ? itemData[0]?.storage._id : itemData.storage;
            }
            if(path.includes("raw-materials" || "raw-material")){
                formik.values.quantity = itemData.length > 0 ? itemData[0]?.quantity : itemData.quantity;
                formik.values.storage  = itemData.length > 0 ? itemData[0]?.storage._id : itemData.storage;
            }
        }
    }, [itemData])

    const formik = useFormik({
        initialValues: {
            quantity: 0,
            remarks: ""
        },
        validationSchema: Yup.object({
            quantity: Yup.number()
                .min(0, "New Quantity must be 1 or more.")
                .required("New Quantity is required."),
            remarks: Yup.string()
                .min(10, "Reamarks must be 10 characters or more.")
                .max(100, "Reamarks must be 100 characters or less.")
                .required("Remarks is required.")
        }),
        onSubmit: async (values, helpers) => {
            let api = "";
            if(path.includes("products" || "product")){
                api = "product";
            }
            if(path.includes("raw-materials" || "raw-material")){
                api = "raw-material";
            }
         
            const adjustResponse = await axios.post("/erp/add_adjustment", { item: itemData.length > 0 ? itemData[0] : itemData, remarks: values.remarks, quantity: values.quantity, user: currentUser?.email })
            if(adjustResponse.statusText === "OK"){
                await axios.put(`/erp/adjust_${api}`, { item: itemData.length > 0 ? itemData[0] : itemData, quantity: values.quantity });
                setVisible(false);
                setAction("adjust");
                helpers.resetForm();
            }
        }
    })

    return (
        <Dialog 
            header="Adjustment" 
            visible={visible} 
            onHide={() => setVisible(false)}
            style={{ width: '50vw' }} 
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className='flex items-center gap-5'>
                    <div className='grid'>
                        <span className='text-sm'>Product Name</span>
                        <span className='text-2xl font-semibold'>{itemData?.length > 0 ? itemData[0]?.name : itemData?.name }</span>
                    </div>
                    <div className='grid'>
                        <span className='text-sm'>On Hand Quantity</span>
                        <span className='text-2xl font-semibold'>{itemData?.length > 0 ? itemData[0]?.quantity : itemData?.quantity }</span>
                    </div>
                </div>
                <div className='form-group mt-4'>
                    <label htmlFor="" className={`${formik.touched.quantity && formik.errors.quantity ? "text-red-400" : ""}`}>
                        {formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : "New Quantity"}
                    </label>    
                    <input 
                        type="number" 
                        name='quantity'
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className='form-group mt-4'>
                    <label htmlFor="" className={`${formik.touched.remarks && formik.errors.remarks ? "text-red-400" : ""}`}>
                        {formik.touched.remarks && formik.errors.remarks ? formik.errors.remarks : "Remarks"}
                    </label> 
                    <textarea 
                        rows="3" 
                        name="remarks"
                        placeholder='e.g. Counted Quantity or Defect Items.'
                        value={formik.values.remarks}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                <div className='mt-6 flex justify-end'>
                    <button type="submit" className='btn-dark-outlined'>Save</button>
                </div>
            </form>
        </Dialog>
    )
}

export default AdjustmentDialog