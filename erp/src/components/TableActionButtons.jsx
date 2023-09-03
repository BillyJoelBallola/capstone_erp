import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'; 
import { toast } from 'react-toastify';
import moment from 'moment';
import axios from 'axios';

const TableActionsButtons = ({ selectedRows, setSelectedRows, setAction, name, setVisible }) => {
    const op = useParams().op;
    const formatName = name.toLowerCase().split(" ").join("-");
    const [productions, setProductions] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const navigate = useNavigate();
    
    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    useEffect(() => {
        axios.get("/erp/productions").then(({ data }) => {
            setProductions(data);
        })
        axios.get("/erp/raw-materials").then(({ data }) => {
            setRawMaterials(data);
        })
        axios.get("/erp/purchases").then(({ data }) => {
            setPurchases(data);
        })
    }, [])

    const timeOut = (e) => {
        const [attendance] = selectedRows;

        confirmPopup({
            target: e.currentTarget,
            message: `Are you sure you want to time-out?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {

                if(attendance.timeOut === null){
                    const response = await axios.put("/erp/timeOut_attendance", { id: attendance._id });
                    if(response.statusText === "OK"){
                        setAction("timeOut");
                        return toast.success("Time out.", { position: toast.POSITION.TOP_RIGHT });
                    }else{
                        return toast.error("Failed to time out.", { position: toast.POSITION.TOP_RIGHT });
                    }
                }else{
                    return toast.warning("Employee already out.", { position: toast.POSITION.TOP_RIGHT });
                }
            },
        });
    }

    const setToActive = (e) => {
        const userData = { ...selectedRows[0], status: true, role: selectedRows[0]?.role === "Administrator" ? true : false };
        const productData = { ...selectedRows[0], status: true };
        const employeeData = { ...selectedRows[0], status: true };

        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to set to active this ${formatName === "user" ? "account" : formatName === "employee" ? "employee" : "product"}?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            accept: async () => {
                try {
                    if(selectedRows.length > 1){
                        axios.put(`/erp/update_many_${formatName}s`, { selectedRows: selectedRows, status: true });
                    }
                    if(selectedRows.length === 1){
                        const data = formatName === "user" ? userData : formatName === "employee" ? employeeData :productData; 
                        await axios.put(`/erp/update_${formatName}`, data);
                    }
                    setAction("active");
                    setSelectedRows(null);
                    toast.success(`${formatName === "user" ? "User" : formatName === "employee" ? "Employee" : "Product"} set to active.`, { position: toast.POSITION.TOP_RIGHT }); 
                } catch (error) {
                    toast.error(`${formatName === "user" ? "User" : formatName === "employee" ? "Employee" : "Product"} failed set to active.`, { position: toast.POSITION.TOP_RIGHT }); 
                } 
            },
        });
    }

    const setToInactive = (e) => {
        const userData = {  ...selectedRows[0], status: false, role: selectedRows[0]?.role === "Administrator" ? true : false };
        const productData = { ...selectedRows[0], status: false };
        const employeeData = {...selectedRows[0], status: false };

        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to set to inactive this ${formatName === "user" ? "account" : formatName === "employee" ? "employee" : "product"}?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    if(selectedRows?.length > 1){
                        axios.put(`/erp/update_many_${formatName}s`, { selectedRows: selectedRows, status: false });
                    }
                    if(selectedRows?.length === 1){
                        const data = formatName === "user" ? userData : formatName === "employee" ? employeeData :productData; 
                        await axios.put(`/erp/update_${formatName}`, data);
                    }
                    setAction("inactive");
                    setSelectedRows(null);
                    toast.success(`${formatName === "user" ? "User" : formatName === "employee" ? "Employee" : "Product"} set to inactive.`, { position: toast.POSITION.TOP_RIGHT }); 
                } catch (error) {
                    toast.error(`${formatName === "user" ? "User" : formatName === "employee" ? "Employee" : "Product"} failed set to inactive.`, { position: toast.POSITION.TOP_RIGHT }); 
                } 
            },
        });
    }

    const replenishProduct = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to create production order for this product?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-help',
            accept: async () => {
                let duplicate = false;
                let good = false;
                let rawMats = [];
                let prodData = selectedRows.length === 1 && selectedRows[0];
               
                rawMaterials?.map(raw => { 
                    prodData.rawMaterials.map(com => {
                        if(raw._id === com.rawId) rawMats = [...rawMats, raw];            
                    })
                });
        
                const computedQty =  prodData.rawMaterials.map(com => ({...com, qty: com.qty * 10}));
                    
                computedQty.map(comQty => {
                    rawMats.map(raw => {
                        if(raw.quantity < comQty.qty){
                            good = true;
                        }
                    })
                })
        
                // productions?.map(prod => {
                //     if(prod.product._id === selectedRows[0]?._id && (prod.state === 1 || prod.state === 2)){
                //         duplicate = true
                //     }
                // })
        
                if(good){
                    return toast.error("Failed to produce. Insufficient raw materials.", { position: toast.POSITION.TOP_RIGHT });
                }
        
                if(duplicate){
                    return toast.error("Production order already issued for this product.", { position: toast.POSITION.TOP_RIGHT });
                }
        
                const response = await axios.post("/erp/production_replenish", { productId: selectedRows[0]?._id, reference: referenceGenerator("PRD") });
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${op}/productions/production-form/${data._id}`);
                }else{
                    return toast.error("Failed to add production order.", { position: toast.POSITION.TOP_RIGHT });
                }
            },
        });
    }

    const replenishMaterial = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to create purchase order for this material?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-help',
            accept: async () => {
                // let duplicate = false;

                purchases?.map(item => {
                    if(item.supplier._id === selectedRows[0]?.supplier._id && (item.state === 1 || item.state === 2)){
                        duplicate = true;
                    }
                })
                
                // if(duplicate){
                //     return toast.error("Can't have a multiple purchase order for a single supplier.", { position: toast.POSITION.TOP_RIGHT });
                // }
                
                const response = await axios.post("/erp/replenish_purchase", { material: selectedRows[0], reference: referenceGenerator("PRS") });
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${op}/purchases/purchase-form/${data._id}`);
                }else{
                    toast.error("Failed to replenish", { position: toast.POSITION.TOP_RIGHT }); 
                }
            },
        });
    }

    const replenishMaterials = async (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: `Do you want to create purchase orders for this materials?`,
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-help',
            accept: async () => {
                let mats = [];
                let total = 0;
                // let duplicate = false;
               
                // purchases?.map(item => {
                //     if(item.supplier._id === selectedRows[0]?.supplier._id && (item.state === 1 || item.state === 2)){
                //         duplicate = true;
                //     }
                // })
        
                // if(duplicate){
                //     return toast.error("Can't have a multiple purchase order for a single supplier.", { position: toast.POSITION.TOP_RIGHT });
                // }
        
                selectedRows.map(item => {
                    const subTotal = item.price * 10;
                    total += subTotal;
                    mats = [
                        ...mats, 
                        {
                            id: item._id,
                            name: item.name,
                            qty: 10,
                            uom: item.measurement,
                            price: item.price
                        }
                    ]
                })
                
                const response = await axios.post("/erp/add_purchase", { supplier: selectedRows[0]?.supplier?._id, date: Date.now(), expectedArrival: Date.now(), materials: mats, total: total, reference: referenceGenerator("PRS") });
                if(response.statusText === "OK"){
                    const data = response.data;
                    navigate(`/${op}/purchases/purchase-form/${data._id}`);
                }else{
                    toast.error("Failed to replenish", { position: toast.POSITION.TOP_RIGHT }); 
                }
            },
        });
    }

    const cancelProcess = async (process) => {
        if(process === "production"){
            const response = await axios.put("/erp/update_production", { _id: selectedRows[0]?._id, product: selectedRows[0]?.product, quantity: selectedRows[0]?.quantity, date: selectedRows[0]?.date, state: 4 });
            if(response.statusText === "OK" ){
                const data = response.data;
                setAction("cancel");
                return toast.success(`Production ${data.reference} has been cancelled.`, { position: toast.POSITION.TOP_RIGHT });
            }else{
                setAction("cancel");
                return toast.error(`Failed to cancel production ${data.reference}.`, { position: toast.POSITION.TOP_RIGHT });
            }
        }
        
        if(process === "purchase"){
            const response = await axios.put("/erp/update_purchase", { _id: selectedRows[0]?._id, supplier: selectedRows[0]?.supplier._id, date: selectedRows[0]?.date, expectedArrival: selectedRows[0]?.expectedArrival, materials: selectedRows[0]?.materials, total: selectedRows[0]?.total, state: 4 });
            if(response.statusText === "OK" ){
                const data = response.data;
                setAction("cancel");
                return toast.success(`Purchase order ${data.reference} has been cancelled.`, { position: toast.POSITION.TOP_RIGHT });
            }else{
                setAction("cancel");
                return toast.error(`Failed to cancel purchase order ${data.reference}.`, { position: toast.POSITION.TOP_RIGHT });
            }
        }
    }

    // manage-user -> user
    if(formatName === "user"){
        if(selectedRows?.length === 1){
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <NavLink to={`/settings/manage-users/user-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                        <button className="btn-gray" onClick={setToActive}>Active</button>
                        <button className="btn-gray" onClick={setToInactive}>Inactive</button>
                    </div>
                </>
           
            )
        }

        if(selectedRows?.length > 1){
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <button className="btn-gray" onClick={setToActive}>Active</button>
                        <button className="btn-gray" onClick={setToInactive}>Inactive</button>
                    </div>
                </>
            )   
        }
    }

    // inventory -> raw-material
    if(op === "inventory" && formatName === "raw-material"){
        if(selectedRows?.length === 1){
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <NavLink to={`/inventory/raw-materials/raw-material-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                        <button className="btn-gray" onClick={() => setVisible(true)}>Adjust</button>
                        <button className="btn-gray" onClick={replenishMaterial}>Replenish</button>
                    </div>
                </>
            )
        }

        if(selectedRows?.length > 1){
            const values = selectedRows.map(item => item.supplier.business);
            const areEqual = values.every(value => value === values[0]);
            return (
                <>
                    <ConfirmPopup />
                    {
                        areEqual && 
                        <div className="flex gap-1 flex-wrap">
                            <button className="btn-gray" onClick={replenishMaterials}>Replenish</button>
                        </div>
                    }
                </>
            )   
        }
    }
    
    // inventory -> production
    if(op === "inventory" && formatName === "product"){
        if(selectedRows?.length === 1){
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <NavLink to={`/inventory/products/product-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                        <button className="btn-gray" onClick={() => setVisible(true)}>Adjust</button>
                        <button className="btn-gray" onClick={replenishProduct}>Replenish</button>
                        <button className="btn-gray" onClick={setToActive}>Active</button>
                        <button className="btn-gray" onClick={setToInactive}>Inactive</button>
                    </div>
                </>
            )
        }

        if(selectedRows?.length > 1){
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <button className="btn-gray" onClick={setToActive}>Active</button>
                        <button className="btn-gray" onClick={setToInactive}>Inactive</button>
                    </div>
                </>
            )   
        }
       
    }

    // inventory -> production
    if((op === "inventory" && formatName === "production") && selectedRows?.length === 1){
        return (
            <>
                <div className="flex gap-1 flex-wrap">
                    <NavLink to={`/inventory/productions/production-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                    {
                        selectedRows[0]?.state === 1 && selectedRows[0]?.state !== 4 && 
                        <button className='btn-gray' onClick={() => cancelProcess("production")}>Cancel</button>
                    }
                </div>
            </>
       
        )
    }

    // inventory -> purchase
    if((op === "inventory" && formatName === "purchase") && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/inventory/purchases/purchase-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                {
                    selectedRows[0]?.state === 1 && selectedRows[0]?.state !== 4 && 
                    <button className='btn-gray' onClick={() => cancelProcess("purchase")}>Cancel</button>
                }
            </div>
        )
    }

    // supply-chain -> production
    if((op === "supply-chain" && formatName === "production") && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/supply-chain/productions/production-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    // supply-chain -> purchase
    if((op === "supply-chain" && formatName === "purchase") && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/supply-chain/purchases/purchase-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                {
                    selectedRows[0]?.state === 1 && selectedRows[0]?.state !== 4 && 
                    <button className='btn-gray' onClick={() => cancelProcess("purchase")}>Cancel</button>
                }
            </div>
        )
    }

    // supply-chain -> suppliers
    if(formatName === "supplier" && Object.keys(selectedRows).length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/${op}/suppliers/supplier-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    //supply-chain -> orders
    if(formatName === "shipment" && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/supply-chain/shipments/shipment-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    // financial -> bill
    if(formatName === "bill" && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/financial/bills/bill-form/${selectedRows[0]?.purchase._id}/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    // financial -> payment
    if(formatName === "payment" && selectedRows?.length === 1){
        let link = "";
        if(selectedRows[0].reference.includes("SPAY")){
            link = `/financial/payments/suppliers/payment-form/${selectedRows[0]?._id}`;
        }
        if(selectedRows[0].reference.includes("CPAY")){
            link = `/financial/payments/customers/payment-form/${selectedRows[0]?._id}`;
        }
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={link} className="btn-gray">View</NavLink>
            </div>
        )
    }

    // financial -> journal entries
    if(formatName === "journal-entrie" && selectedRows?.length === 1){
        let link = "";
        if(selectedRows[0].reference.includes("PAY")){
            link = `/financial/payments/payment-form/${selectedRows[0]?._id}`;
        }
        if(selectedRows[0].reference.includes("BILL")){
            link = `/financial/bills/bill-form/${selectedRows[0]?.purchase._id}/${selectedRows[0]?._id}`;
        }
        if(selectedRows[0].reference.includes("INV")){
            link = `/financial/invoices/invoice-form/${selectedRows[0]?.order._id}/${selectedRows[0]?._id}`;
        }
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={link} className="btn-gray">View</NavLink>
            </div>
        )
    }

    //financial -> invoices
    if(formatName === "invoice" && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/financial/invoices/invoice-form/${selectedRows[0]?.order?._id}/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    //sales -> orders 
    if(formatName === "order" && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/sales/orders/order-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    //sales -> customers 
    if(formatName === "customer" && selectedRows?.length === 1){
        return (
            <div className="flex gap-1 flex-wrap">
                <NavLink to={`/sales/customers/customer-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
            </div>
        )
    }

    //human-resource -> employees 
    if(formatName === "employee" && selectedRows?.length === 1){
        if (selectedRows?.length === 1) {
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <NavLink to={`/human-resource/employees/employee-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
                        <button className="btn-gray" onClick={setToActive}>Active</button>
                        <button className="btn-gray" onClick={setToInactive}>Inactive</button>
                    </div>
                </>
            )
        }

        if(selectedRows?.length > 1){
            return (
                <>
                    <ConfirmPopup />
                    <div className="flex gap-1 flex-wrap">
                        <button className="btn-gray" onClick={setToActive}>Active</button>
                        <button className="btn-gray" onClick={setToInactive}>Inactive</button>
                    </div>
                </>
            )   
        }
    }

    //human-resource -> attendance 
    if(formatName === "attendance" && selectedRows?.length === 1){
        return (
            <>
                <ConfirmPopup />
                <div className="flex gap-1 flex-wrap">
                    <button className="btn-gray" onClick={timeOut}>Time-out</button>
                </div>
            </>
        )
    }

    //human-resource -> payroll 
    if(formatName === "payroll" && selectedRows?.length === 1){
        return <NavLink to={`/human-resource/payrolls/payroll-form/${selectedRows[0]?._id}`} className="btn-gray">View</NavLink>
    }
}

export default TableActionsButtons;

