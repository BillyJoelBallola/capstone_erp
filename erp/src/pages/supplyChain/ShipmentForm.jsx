import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useParams, NavLink } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from 'moment';

const ShipmentForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const [shipment, setShipment] = useState({});
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState(null);
    const [customer, setCustomer] = useState({});
    const [action, setAction] = useState("");

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formik = useFormik({
        initialValues: {
            scheduledDate: "",
            expectedArrival: ""
        },
        validationSchema: (values) => Yup.object({
            scheduledDate: Yup.date()
                .min(moment(yesterday).format(), "Schedule Date date must be either today or a future date.")
                .required("Schedule Date date is required."),
            expectedArrival: Yup.date()
                .min(moment(values?.scheduledDate).format(), "Expected Arrival date must be the same day of scheduled date or further from that.")
                .required("Expcted Arrival date is required."),
        }),
        onSubmit: async (values) => {
            const response = await axios.put("/erp/update_shipment", { id: id, ...values });
            if(response.statusText === "OK"){
                axios.put("/erp/change_shipment_state", { id: id, state: 2 });
                setAction("confirm");
                return toast.success("Shipment confirm successfully.", { position: toast.POSITION.TOP_RIGHT });
            }else{
                return toast.error("Failed to confirm shipment.", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    useEffect(() => {
        axios.get("/erp/customers").then(({ data }) => {
            setCustomers(data);
        })
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data);
        })
    }, [])

    useEffect(() => {
        if(id || action){
            axios.get(`/erp/shipment/${id}`).then(({ data }) => {
                setShipment(data);
                formik.values.expectedArrival = data.expectedArrival ? moment(data.expectedArrival).format().slice(0, 10) : "";
                formik.values.scheduledDate = data.scheduledDate ? moment(data.scheduledDate).format().slice(0, 10) : "";
                setAction("");
            })
        }
    }, [id, action])

    useEffect(() => {
        if(customers && shipment){
            const data = customers.find(customer => {
                return customer._id.toString() === shipment?.order?.customer
            })
            setCustomer(data);
        }
    }, [customers, shipment])

    const StateStyle = () => {
        return (
            <div className="flex justify-end">
                <div className="max-w-min p-2 font-semibold text-sm flex items-center justify-center gap-3 relative">
                    <div className="w-4/5 h-[2px] bg-gray-300 absolute"/>
                    <div className={`${shipment.state === 1 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Pending</div>
                    <div className={`${shipment.state === 2 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10 whitespace-nowrap`}>Ready</div>
                    <div className={`${shipment.state === 3 && shipment?.order?.state !== 4 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Ship</div>
                    {
                        shipment?.order?.state === 4 && shipment.state === 3 &&
                        <div className={`text-blue-400 border-blue-400 bg-gray-200 border px-2 rounded-full z-10`}>Done</div>
                    } 
                </div>
            </div>
        )
    }

    const handleShip = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to set to ship this shipment order?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-info',
            accept: async () => {
                const response = await axios.put("/erp/change_shipment_state", { id: id, state: 3 });
                if(response.statusText === "OK"){
                    await axios.put("/erp/change_order_state", { id: shipment.order._id, invoice: shipment.order.invoice, state: 3 });
                    setAction("ship");
                    return toast.success("Order has been set to ship.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to ship the orders.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        });
    }

    return (
        <>  
            <ToastContainer draggable={false} hideProgressBar={true} />
            <ConfirmPopup />
            <div>
                <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">
                                Shipment
                            </span>
                            <div className="flex items-center gap-1 -mt-2 text-sm font-semibold">
                                <span>
                                    {shipment?.reference}
                                </span>
                                <NavLink className="text-blue-500" to={`/${op === "sales" ? "sales" : "supply-chain"}/orders/order-form/${shipment?.order?._id}`}>
                                    ({shipment?.order?.reference})
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {
                                (shipment.state === 1 && op === "supply-chain") &&
                                <button form='shipment-form' className='btn-dark-gray' type='submit'>Confirm</button>
                            }
                            {
                                (shipment.state === 2 && op === "supply-chain") &&
                                <button className='btn-primary px-4 py-2' onClick={handleShip}>Ship</button>
                            }
                        </div>
                        { id && <StateStyle /> }
                    </div>
                    <form className="p-4 border bg-white" id='shipment-form' onSubmit={formik.handleSubmit}>
                        <div className="grid gap-10 grid-cols-2">
                            <div className='grid gap-4'>
                                <div className='grid'>
                                    <span className='text-sm'>Customer</span>
                                    <span className='text-xl font-semibold'>{customer?.name}</span>
                                </div>
                                <div className='grid'>
                                    <span className='text-sm'>Address</span>
                                    <span>{`${customer?.address?.street}, ${customer?.address?.barangay}, ${customer?.address?.municipal}, ${customer?.address?.province}, ${customer?.address?.country}`}</span>
                                </div>
                            </div>
                            <div className='grid gap-4'>
                                <div className='form-group'>
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.scheduledDate &&
                                            formik.errors.scheduledDate
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.scheduledDate &&
                                        formik.errors.scheduledDate
                                            ? formik.errors.scheduledDate
                                            : "Schedule Date"}
                                    </label>
                                    <input     
                                        disabled={shipment?.state >= 2 ? true : false}
                                        type="date"
                                        name='scheduledDate'
                                        value={formik.values.scheduledDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} 
                                    />
                                </div>
                                <div className='form-group'>
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
                                        disabled={shipment?.state >= 2 ? true : false}
                                        type="date"
                                        name='expectedArrival'
                                        value={formik.values.expectedArrival}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} 
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ShipmentForm;