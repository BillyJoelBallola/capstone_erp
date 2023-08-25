import React, { useEffect, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import AdjustmentDialog from '../../components/AdjustmentDialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useFormik } from "formik";
import placeHolder from "../../assets/placeholder.png";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";

const ProductForm = () => {
    const id = useParams().id;
    const op = useParams().op;
    const navigate = useNavigate();
    const location = op === "inventory" ? "inventory" : "supply-chain";  
    const [uploadedImage, setUploadedImage] = useState("");
    const [data, setData] = useState({});
    const [action, setAction] = useState("");
    const [visible, setVisible] = useState(false);
    const [prods, setProds] = useState([]);
    const [storages, setStorages] = useState([]);
    const [rawMaterialsData, setRawMaterialData] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [solds, setSolds] = useState(0);
    const [instruction, setInstruction] = useState({
        text: "",
        idx: ""
    });
    const [component, setComponent] = useState({
        rawId: "",
        name: "",
        uom: "",
        price: "",
        inStock: "",
        qty: 0
    });
    const [forecasts, setForecasts] = useState([]);
    const [total, setTotal] = useState({
        inComing: 0,
        outGoing: 0,
        totalUnit: 0
    });

    useEffect(() => {
        axios.get("/erp/productions")
            .then(({ data }) => {
                const incomingProduct = data.filter(item => (item.product._id === id && item.state === 2));
                return incomingProduct;
            })
            .then((incomingProduct) => {
                axios.get("/erp/shipments").then(({ data }) => {
                    let outGoing = [];
                    data.map(shipment => {
                        if(shipment.state >= 2 && (shipment.order.state === 2 || shipment.order.state === 3)){
                            shipment?.order?.orders?.filter(prod => {
                                if(prod.productId === id){
                                    return outGoing.push(shipment)
                                }
                            })
                        }
                    });
                    setForecasts([...incomingProduct, ...outGoing]);    
                })
            })

        axios.get("/erp/orders").then(({ data }) => {
            const completedOrders = data.filter(item => item.state === 4);
            const ordersData = completedOrders.map(ord => ord.orders.filter(order => order.productId === id));
            let numberOfSolds = 0;

            ordersData.filter(sold => {
                if(sold.length !== 0){
                    sold.map(s => {
                        return numberOfSolds += s.quantity;
                    })
                }
            })

            setSolds(numberOfSolds);
        })
    }, [])

    useEffect(() => {
        if(forecasts.length !== 0){
            let inComing = 0;
            let outGoing = 0;
            forecasts.map(item => {
                if(item.reference.includes("PRD")){
                    inComing = item.quantity;
                }
                if(item.reference.includes("SHP")){
                    item.order.orders.map(prod => {
                        if(prod.productId === id){
                            return outGoing += prod.quantity;
                        }
                    })
                }
            })
            setTotal(prev => ({...prev, inComing: inComing, outGoing: outGoing}));
        }
    }, [forecasts]);
    
    useEffect(() => {
        const fetchData = async () => {
            const [productionsResponse, storagesResponse, rawMaterialsResponse, categoriesResponse] = await Promise.all([
                axios.get("/erp/productions"),
                axios.get("/erp/storages"),
                axios.get("/erp/raw-materials"),
                axios.get("/erp/categories")
            ]);

            setProds(productionsResponse.data);
            setStorages(storagesResponse.data);
            setRawMaterialData(rawMaterialsResponse.data);
            setCategories(categoriesResponse.data);
        };
    
        fetchData();
    }, [])
    
    useEffect(() => {
        if(id){
            axios.get(`/erp/product/${id}`).then(({ data }) => {
                formik.values._id = data._id;
                formik.values.productImg = data.productImg;
                formik.values.name = data.name;
                formik.values.category = data.category;
                formik.values.description = data.description;
                formik.values.status = data.status;
                formik.values.price = data.price;
                formik.values.quantity = data.quantity;
                formik.values.measurement = data.measurement;
                formik.values.storage = data.storage;
                formik.values.date = data.date;
                setRawMaterials(data.rawMaterials);
                setData(data);
                setAction("");
            })
            axios.get(`/erp/adjustment/${id}`).then(({ data }) => {
                setAdjustments(data);
            })
        }
    }, [action])
    
    const formik = useFormik({
        initialValues: {
            _id: "",
            productImg: "",
            name: "",
            category: "",
            description: "",
            status: true,
            price: 0,
            quantity: 0,
            measurement: "",
            storage: "",
            date: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(4, "Product Name must be 4 characters or more.")
                .required("Product Name is required."),
            description: Yup.string()
                .min(5, "Description is too short.")
                .max(50, "Descriptio must be 50 characters or less")
                .required("Description is required"),
            price: Yup.number()
                .min(1, "Price must be 1 Peso or more.")
                .required("Price is required."),
            quantity: Yup.number()
                .min(0, "In Stock Quantity must be 1 or more."),
            measurement: Yup.string()
                .required("Unit of Measurement is required."),
            storage: Yup.string()
                .required("Storage is required."),
            category: Yup.string()
                .required("Category is required.")
        }),
        onSubmit: async (values) => {
            if(id){
                const response = await axios.put("/erp/update_product", { ...values, rawMaterials: rawMaterials, instructions: instructions });
                if(response.statusText === "OK"){
                    return toast.success("Product edited successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add product.", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const response = await axios.post("/erp/add_product", { ...values, rawMaterials: rawMaterials, instructions: instructions });
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${location}/products/product-form/${data._id}`);
                    return toast.success("Product added successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add product.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    })

    const removeItem = (idx) => {
        const newRawMaterialData = [...rawMaterials];
        newRawMaterialData.splice(idx, 1);
        setRawMaterials(newRawMaterialData);
    }

    const removeInstruction = (idx) => {
        const instuctionData = [...instructions];
        instuctionData.splice(idx, 1);
        setInstructions(instuctionData);
    }

    const resetComponent = () => {
        setComponent({
            rawId: "",
            name: "",
            uom: "",
            inStock: "",
            qty: 0
        });
    }

    const resetIntruction = () => {
        setInstruction({
            text: "",
            idx: ""
        });
    }

    useEffect(() => {
        if(component.rawId){
            const selectedMats = rawMaterialsData.filter(item => (item._id === component.rawId));
            if(selectedMats.length !== 0){
                const { name, measurement, price, quantity } = selectedMats[0];
                setComponent(prev => ({...prev, name: name, uom: measurement, price: price, inStock: quantity}))
            }
        }
    }, [component.rawId])

    const addInstruction = () => {
        if(instruction.text === ""){
            return toast.warning("Instruction is empty", { position: toast.POSITION.TOP_RIGHT });
        }
        setInstructions(prev => ([...prev, instruction.text]));
        resetIntruction();
    }

    const editInstruction = () => {
        if(instruction.text === ""){
            return toast.warning("Instruction is empty", { position: toast.POSITION.TOP_RIGHT });
        }
        instructions.splice(instruction.idx, instruction.idx + 1, instruction.text);
        resetIntruction();
    }

    const pushRawMats = () => {
        if(component?.rawId === ""){
            return toast.warning("Select an item.", { position: toast.POSITION.TOP_RIGHT });
        }

        if(component?.qty === 0 || component?.qty === ""){
            return toast.warning("Quantity must be 1 or more.", { position: toast.POSITION.TOP_RIGHT });
        }

        const duplicateItem = rawMaterials.filter((item) => (component.rawId === item.rawId));
        if(duplicateItem.length >= 1){
            resetComponent();
            return toast.error("Failed to add item that already exist in the list.", { position: toast.POSITION.TOP_RIGHT });
        }
     
        setRawMaterials(prev => ([...prev, component]));
        resetComponent();
    }

    const pushEditedRawMats = () => {
        if(component?.rawId === ""){
            return toast.warning("Select an item.", { position: toast.POSITION.TOP_RIGHT });
        }

        if(component?.qty === 0 || component?.qty === ""){
            return toast.warning("Quantity must be 1 or more.", { position: toast.POSITION.TOP_RIGHT });
        }

        rawMaterials.splice(component.idx, component.idx + 1, component);
        resetComponent();
    }

    const replenish = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to create purchase orders for this materials?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                let duplicate = false;
                let good = false;
                let rawMats = [];
        
                rawMaterialsData?.map(raw => { 
                    rawMaterials.map(com => {
                        if(raw._id === com.rawId) rawMats = [...rawMats, raw];            
                    })
                });
                
                const computedQty =  rawMaterials.map(com => ({...com, qty: com.qty * 10}));
                    
                computedQty.map(comQty => {
                    rawMats.map(raw => {
                        if(raw.quantity < comQty.qty){
                            good = true;
                        }
                    })
                })
        
                // prods?.map(prod => {
                //     if(prod.product._id === id && (prod.state === 1 || prod.state === 2)){
                //         duplicate = true;
                //     }
                // })
        
                if(good){
                    return toast.error("Failed to produce. Insufficient raw materials.", { position: toast.POSITION.TOP_RIGHT });
                }
        
                if(duplicate){
                    return toast.error("Production order already issued for this product.", { position: toast.POSITION.TOP_RIGHT });
                }
        
                const response = await axios.post(`/erp/production_replenish/${id}`);
                if(response.statusText === "OK"){
                    setAction("replenish")
                    return toast.success("Production order successfully added.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add production order for this product.", { position: toast.POSITION.TOP_RIGHT });
                }
            },
        });
    }

    const selectInstruction = (idx) => {
        const instructValue = instructions[idx];
        setInstruction({
            text: instructValue,
            idx: idx
        })
    }

    const selectMats = (idx) => {
        const matsValues = rawMaterials[idx];
        setComponent({
            idx: idx,
            rawId: matsValues.rawId,
            name: matsValues.name,
            uom: matsValues.uom,
            price: matsValues.price,
            inStock: matsValues.inStock,
            qty: matsValues.qty
        })
    }

    const uploadImage = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      if(file !== undefined){
        formData.append("image", file);
        const {data: filename} = await axios.post("/erp/upload_image", formData, {
          headers: { "Content-type": "multipart/form-data" },
        });
        setUploadedImage(filename);
        setAction("upload");
      }     
    }
  
    useEffect(() => {
      if(uploadedImage !== ""){
        axios.put("/erp/update_img_product", { uploadedImage: uploadedImage, id: id }).then(({ data }) => {
            formik.values.productImg = data.productImg;
            setAction("");
        })
      }
    }, [uploadedImage])

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
                <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center justify-between py-4 border-0 border-b border-b-gray-200 bg-white">
                    <div className='flex items-center gap-3'>
                        {
                            op === "inventory" ?
                            <>
                                <button type="submit" className="btn-outlined px-4" form="product-form">
                                {id ? "Edit" : "Save"}
                                </button>
                                <div className="grid justify-center">
                                    <span className="text-lg font-semibold">Product</span>
                                    <span className="text-sm font-semibold -mt-2">{id ? "Edit" : "New"}</span>
                                </div>
                            </>
                            : 
                            <div className='flex gap-1 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                                <span className="text-lg font-semibold">Product</span>
                            </div>
                        }      
                    </div>
                    {
                        id && 
                        <div className='flex border border-gray-400 py-[1px] rounded-md text-xs'>
                            <NavLink to={`/${location}/product_forecast/${id}`} className='flex gap-1 items-center px-2 rounded-s-md hover:bg-gray-200'>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                <div className='grid text-left'>
                                    <span>Forecasted</span>
                                    <span className='-mt-1 font-semibold'>{formik.values.quantity + total.inComing - total.outGoing} Units</span>
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
                                    <span>Sold</span>
                                    <span className='-mt-1 font-semibold'>{solds} Units</span>
                                </div>
                            </button>
                        </div>
                    }
                    {
                        id && 
                        <div className="flex gap-1">
                            <button className="btn-gray" onClick={replenish}>Replenish</button>
                            {
                                op === "iventory" &&
                                <button className="btn-gray" onClick={() => setVisible(true)}>Adjust</button>
                            }
                        </div>
                    }
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <form className="p-4 border grid gap-4 bg-white" id="product-form" onSubmit={formik.handleSubmit}>
                        <div className="flex justify-between">
                            <div className='w-2/3 flex flex-col gap-4'>
                                <div className="form-group">
                                    <label htmlFor="" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Product Name"}
                                    </label>    
                                    <input
                                        autoFocus
                                        type="text"
                                        style={{ fontSize: "larger", fontWeight: 600 }}
                                        placeholder="e.g. Longganisa"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <input 
                                            type="checkbox" 
                                            id='isActive'
                                            name="status" 
                                            checked={formik.values.status} 
                                            onChange={formik.handleChange}
                                        />
                                        <label htmlFor="isActive" className='cursor-pointer font-semibold'>{!formik.values.status ? "Inactive (This product can't be purchase)" : "Active"}</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <input accept="image/*" type="file" id="productImage" className="hidden" onChange={uploadImage}/>
                                <label htmlFor="productImage"  className="flex items-center justify-center w-24 max-h-min overflow-hidden cursor-pointer border hover:border-gray-400">
                                    <img
                                        src={formik.values.productImg === "" ? placeHolder : `http://localhost:4000/uploads${formik.values.productImg}`}
                                        alt="user-image"
                                        className="object-contain"
                                    />
                                </label>
                            </div>
                        </div>
                        <div>
                            <TabView>
                                <TabPanel header="Information">
                                    <div className='grid gap-10 grid-cols-2'>
                                        <div>
                                            <div className='grid gap-6'>
                                                <div className='form-group'>
                                                    <label htmlFor="" className={`${formik.touched.description && formik.errors.description ? "text-red-400" : ""}`}>
                                                        {formik.touched.description && formik.errors.description ? formik.errors.description : "Description"}
                                                    </label>   
                                                    <textarea 
                                                        rows="3"
                                                        name='description' 
                                                        placeholder='Short product description'
                                                        value={formik.values.description}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                </div>
                                                <div className='form-group'>
                                                    <label htmlFor="" className={`${formik.touched.price && formik.errors.price ? "text-red-400" : ""}`}>
                                                        {formik.touched.price && formik.errors.price ? formik.errors.price : "Price"}
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
                                                    <label htmlFor="" className={`${formik.touched.category && formik.errors.category ? "text-red-400" : ""}`}>
                                                        {formik.touched.category && formik.errors.category ? formik.errors.category : "Category"}
                                                    </label>  
                                                    <select
                                                        name='category'
                                                        value={formik.values.category}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <option value="">-- select category --</option>
                                                        {
                                                            categories.map(cat => (
                                                                <option value={cat._id} key={cat._id}>{cat.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
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
                                </TabPanel>
                                <TabPanel header="Components">
                                    <div>
                                        <div className='mb-4 grid grid-cols-[1fr_100px_100px_100px_80px] items-center gap-10'>
                                            <span className='font-semibold text-gray-600'>Item</span>        
                                            <span className='font-semibold text-gray-600'>In Stock Qty</span>        
                                            <span className='font-semibold text-gray-600'>Measurement</span>        
                                            <span className='font-semibold text-gray-600'># Qty</span>        
                                        </div>
                                        <div className='grid grid-cols-[1fr_100px_100px_100px_80px] items-center gap-10'>
                                            <select 
                                                className='w-full min-w-32'
                                                value={component.rawId}
                                                onChange={(e) => setComponent((prev) => ({ ...prev, rawId: e.target.value }))}
                                            >
                                                <option value="">-- select item --</option>
                                                {
                                                    rawMaterialsData?.map((rawMat) => (
                                                        <option value={rawMat._id} key={rawMat._id}>{rawMat.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className='font-semibold'>{component.inStock ? component.inStock : "--"}</span>
                                            <span className='font-semibold'>{component.uom ? component.uom : "--"}</span>
                                            <input 
                                                type="number"  
                                                placeholder='0'
                                                value={component.qty}
                                                onChange={(e) => setComponent(prev => ({...prev, qty: e.target.value }))}
                                            />
                                            <div className="flex gap-1 items-center justify-center">
                                                <div className='btn-primary p-1 max-w-min cursor-pointer' onClick={component.idx >= 0 ? pushEditedRawMats : pushRawMats}>
                                                    {
                                                        component.idx >= 0 ? 
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
                                                    component.idx >= 0 &&
                                                    <div className='btn-primary max-w-min p-1 cursor-pointer' onClick={resetComponent}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                }
                                             
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div className='bg-gray-100 border-x-0 border border-y-gray-300'>
                                            {   
                                                rawMaterials?.length > 0 ?
                                                rawMaterials?.map((item, idx) => (
                                                    <div key={item.rawId} className={`grid grid-cols-[1fr_100px_100px_50px] p-3 items-center gap-10 cursor-pointer hover:bg-gray-300 ${component.idx === idx ? "bg-gray-300" : ""}`} onClick={() => selectMats(idx)}>
                                                        <span>{item.name}</span>
                                                        <span>{item.uom}</span>
                                                        <span>{item.qty}</span>
                                                        <div className='cursor-pointer max-w-min z-20' onClick={() => removeItem(idx)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))
                                                :
                                                <div className='font-semibold py-4 px-3'>No items yet</div>
                                            }
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel header="Instructions">
                                    <div>
                                        <div className='mb-4'>
                                            <span className='font-semibold text-gray-600'>Cooking Instruction</span>         
                                        </div>
                                        <div className='grid grid-cols-[1fr_80px] gap-5 items-center'>
                                            <input 
                                                type="text" 
                                                placeholder='Instruction'
                                                value={instruction.text}
                                                onChange={(e) => setInstruction((prev) => ({...prev, text: e.target.value }))}
                                            />
                                            <div className="flex gap-1 items-center justify-center">
                                                <div className='btn-primary p-1 max-w-min cursor-pointer' onClick={instruction.idx !== "" ? editInstruction : addInstruction}>
                                                    {
                                                        instruction.idx !== "" ? 
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
                                                    instruction.idx !== "" &&
                                                    <div className='btn-primary max-w-min p-1 cursor-pointer' onClick={resetIntruction}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                }
                                             
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <div className='bg-gray-100 border-x-0 border border-y-gray-300'>
                                            {   
                                                instructions.length > 0 ?
                                                instructions?.map((instruct, idx) => (
                                                    <div className={`grid grid-cols-[40px_1fr_50px] p-3 hover:bg-gray-300 ${instruction.idx === idx ? "bg-gray-300" : ""}`} key={idx} onClick={() => selectInstruction(idx)}>
                                                        <span>{idx + 1}.</span>
                                                        <span>{instruct}</span>
                                                        <div className='cursor-pointer max-w-min z-20 grid place-items-center' onClick={() => removeInstruction(idx)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                ))
                                                :
                                                <div className='font-semibold py-4 px-3'>No instructions yet</div>
                                            }
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabView>
                        </div>
                    </form>
                    {
                        id && 
                        <div className='grid gap-3'>
                            <div className='mt-4 text-sm'>
                                {`${moment(formik.values.date).format("LL")} - Product Created.`}
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

export default ProductForm