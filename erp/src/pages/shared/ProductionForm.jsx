import React, { useEffect, useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { Tooltip } from 'primereact/tooltip';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'; 
import { useFormik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import axios from "axios";

const ProductionForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const [reference, setReference] = useState("");
    const [products, setProducts] = useState([]);
    const [productions, setProductions] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [components, setComponents] = useState([]);
    const [action, setAction] = useState("");
    const [state, setState] = useState(0);

    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    const formik = useFormik({
        initialValues: {
            product: "",
            quantity: 0,
            date: "",
            automate: false
        },
        validationSchema: Yup.object({
            product: Yup.string()
                .required("Product is required."),
            quantity: Yup.number()
                .min(0, "In Stock Quantity must be 1 or more.")
                .required("Quantity is required."),
            date: Yup.date()
                .required("Date is required.")
        }),
        onSubmit: async (values) => {
            let rawMats = [];
            let good = false;
            let duplicate = false;

            rawMaterials?.map(raw => { 
                components?.map(com => {
                    if(raw._id === com.rawId) rawMats = [...rawMats, raw];            
                })
            });

            const computedQty = components?.map(com => ({...com, qty: com.qty * values.quantity}));
            
            computedQty?.map(comQty => {
                rawMats.map(raw => {
                    if(raw.quantity < comQty.qty){
                        good = true;
                    }
                })
            })

            productions?.map(prod => {
                if(prod.product._id === values.product && (prod.state !== 3 && prod.state !== 4)){
                    duplicate = true;
                }
            })

            if(good){
                return toast.error("Failed to produce. Insufficient raw materials.", { position: toast.POSITION.TOP_RIGHT });
            }

            // if(!id){
            //     if(duplicate){
            //         return toast.error("Production order already issued for this product.", { position: toast.POSITION.TOP_RIGHT });
            //     }
            // }
            
            if(id){
                const { product, quantity, date, automate } = values; 
                const response = await axios.put("/erp/update_production", { _id: id, product: product, quantity: quantity, date: date, state: state, automate: automate });
                if(response.statusText === "OK"){
                    return toast.success("Edited Successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to edit production", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_production", { product: values.product, quantity: values.quantity, date: values.date, automate: values.automate, reference: referenceGenerator("PRD") });
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${op}/productions/production-form/${data._id}`);
                    return toast.success("Added Successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add production", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })

    useEffect(() => {
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data);
        })
        axios.get("/erp/raw-materials").then(({ data }) => {
            setRawMaterials(data);
        })
        axios.get("/erp/productions").then(({ data }) => {
            setProductions(data);
        })
    }, [])

    useEffect(() => {
        const data = products.filter(item => (item._id === formik.values.product));
        setComponents(data && data[0]?.rawMaterials);
    }, [formik.values.product])

    useEffect(() => {
        if(id){
            axios.get(`/erp/production/${id}`).then(({ data }) => { 
                axios.get(`/erp/product/${data.product}`).then(({ data }) => ( setComponents(data.rawMaterials) ));
                formik.values.automate = data.automate;
                formik.values.product = data.product;
                formik.values.quantity = data.quantity;
                setReference(data.reference);
                formik.values.date = data.date.toString().slice(0, 10);
                setState(data.state);
                setAction("");
            })
        }
    }, [id, action])

    const StateStyle = () => {
        return (
            <div className="flex justify-end">
                <div className="max-w-min p-2 font-semibold text-sm flex items-center justify-center gap-3 relative">
                    <div className="w-4/5 h-[2px] bg-gray-200 absolute"/>
                    <div className={`${state === 1 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Pending</div>
                    <div className={`${state === 2 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Confirm</div>
                    <div className={`${state === 3 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Done</div>
                    {
                        state === 4 &&
                        <div className={`${state === 4 ? "text-blue-400 border-blue-400" : "text-gray-400"} bg-gray-200 border px-2 rounded-full z-10`}>Cancelled</div>
                    }
                </div>
            </div>
        )
    }

    const productionOrderState = async (e, state) => {
        let msg = "";
        let successMsg = "";
        let errorMsg = "";
        let btnStyle = "";

        switch(state){
            case 2:
                successMsg = "Production order confirm successfully.";
                errorMsg = "Failed to confirm production order.";
                msg = "Do you want to confirm production order?";
                btnStyle = "p-button-success";
                break; 
            case 3: 
                successMsg = "Production order is set to finished successfully.";
                errorMsg = "Failed to set to finish production order.";
                msg = "Do you want to finish production order?";
                btnStyle = "p-button-info";
                break; 
            case 4: 
                successMsg = "Production order cancelled successfully.";
                errorMsg = "Failed to cancel production order.";
                msg = "Do you want to cancel production order?";
                btnStyle = "p-button-danger";
                break; 
        }

        confirmPopup({
            target: e.currentTarget,
            message: msg,
            icon: 'pi pi-info-circle',
            acceptClassName: btnStyle,
            accept: async () => {
                const response = await axios.put("/erp/change_production_state", { state: state, id: id });
                if(response.statusText === "OK"){
                    setAction("change");
                    return toast.success(successMsg, { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
                }
            },
        });
    }

    return (
        <>
            <ToastContainer draggable={false} hideProgressBar={true} />
            <ConfirmPopup />
            <div>
                <div className="z-20 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="btn-outlined px-4"
                            form="user-form"
                        >
                            {id ? "Edit" : "Save"}
                        </button>
                        <div className="grid justify-center">
                            <span className="text-lg font-semibold">
                                Production
                            </span>
                            <span className="text-sm font-semibold -mt-2">
                                {id ? reference : "New"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tooltip target=".automate" mouseTrack />
                        <label className="">Automate</label>
                        <InputSwitch 
                            tooltipOptions={{ position: 'bottom', mouseTrack: true }}
                            tooltip="If automation is enabled. This production order will be added to smart replenishment, which will automatically reorder if the stock trigger is met."
                            className="automate"
                            name="automate"
                            checked={formik.values.automate}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {
                                op !== "inventory" &&
                                (state === 1 || state === 2) && 
                                <button 
                                    className={`${state === 2 ? "btn-primary px-4 py-2" : "btn-gray"}`} 
                                    onClick={(e) => 
                                        state === 1 ? 
                                        productionOrderState(e, 2) :
                                        state === 2 ? 
                                        productionOrderState(e, 3) : null
                                }>{
                                    state === 1 ? 
                                    "Confirm Order" : 
                                    state === 2 ? 
                                    "Produce All" : ""}
                                </button>
                            }
                            {
                                op !== "inventory" &&
                                (state === 1 || state === 2) &&
                                <button className="btn-gray" onClick={(e) => productionOrderState(e, 4)}>Cancel</button>
                            }
                        </div>
                        { id && <StateStyle /> }
                    </div>
                    <form
                        className="p-4 border grid gap-4 bg-white"
                        id="user-form"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="grid grid-cols-2 gap-10">
                            <div className="flex flex-col gap-4">
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.product &&
                                            formik.errors.product
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.product &&
                                        formik.errors.product
                                            ? formik.errors.product
                                            : "Product"}
                                    </label>
                                    <select 
                                        disabled={state === 3 ? true : false}
                                        autoFocus
                                        name="product"
                                        value={formik.values.product}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">-- select product --</option>
                                        {
                                            products?.map(item => (
                                                <option value={item._id} key={item._id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor=""
                                        className={`${
                                            formik.touched.quantity &&
                                            formik.errors.quantity
                                                ? "text-red-400"
                                                : ""
                                        }`}
                                    >
                                        {formik.touched.quantity &&
                                        formik.errors.quantity
                                            ? formik.errors.quantity
                                            : "Quantity"}
                                    </label>
                                    <input 
                                        disabled={state === 3 ? true : false}
                                        type="number"
                                        name="quantity"
                                        placeholder="0"
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                            <div>
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
                                            : "Date"}
                                    </label>
                                    <input 
                                        disabled={state === 3 ? true : false}
                                        type="date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl my-4">Components</div>
                            <div className='mb-1 grid grid-cols-[1fr_100px_100px_100px] items-center gap-12 px-3'>
                                <span className='font-semibold text-gray-600'>Item</span>        
                                <span className='font-semibold text-gray-600'># Qty</span>        
                                <span className='font-semibold text-gray-600'>Measurement</span>      
                            </div>
                            <div className="bg-gray-100 border-x-0 p-3 border border-y-gray-300 grid gap-4">
                                {components?.length > 0 ? (
                                    components?.map(
                                        (item) => (
                                            <div
                                                key={item.rawId}
                                                className="grid grid-cols-[1fr_100px_100px_100px] items-center gap-10"
                                            >
                                                <span className="font-semibold">
                                                    {item.name}
                                                </span>
                                                <span className="font-semibold">
                                                    {item.qty}
                                                </span>
                                                <span className="font-semibold">
                                                    {item.uom}
                                                </span>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <span className="font-semibold">
                                        No items yet
                                    </span>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductionForm;
