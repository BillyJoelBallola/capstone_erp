import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import TableActionsButtons from "./TableActionButtons";
import { NavLink, useLocation, useParams } from "react-router-dom";
import AdjustmentDialog from "./AdjustmentDialog";
import placeHolder from "../assets/placeholder.png";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";

const CustomTable = ({ name, dataValue, columns, setAction}) => {
    const op = useParams().op;
    const formattedName = name.toLowerCase().split(" ").join("-");
    const currentLocation = useLocation().pathname;
    const [productions, setProductions] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [components, setComponents] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [visible, setVisible] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        axios.get("/erp/productions").then(({ data }) => {
            setProductions(data);
        })
        axios.get("/erp/raw-materials").then(({ data }) => {
            setRawMaterials(data);
        })
    }, [])

    const addressFormat = (rowData) => {
        const { address } = rowData;
        return <span>{`${address?.street}, ${address?.barangay}, ${address?.municipal}, ${address?.province}, ${address?.country}`}</span>
    }

    const quantityStatus = (rowData) => {
        const { quantity } = rowData;
        let color = "";
        let text  = "";
        let label = "";

        if(quantity <= 10){
            color = "bg-red-100";
            text = "text-red-700";
            label = "Reorder";
        }
        if(quantity > 11){
            color = "bg-green-100";
            text = "text-green-700";
            label = "Sufficient";
        }

        return <span className={`px-2 rounded-md font-semibold text-sm ${color} ${text}`}>{label}</span>;
    }

    const imageTemplate = (rowData) => {
        const { productImg } = rowData;

        return (
            <div className="w-14 aspect-square grid place-items-center rounded-md">
                <img className="object-contain" src={productImg === "" ? placeHolder : `http://localhost:4000/uploads${productImg}`} alt="product-image" />
            </div>
        )
    }

    const isActive = (rowData) => {
        const { status } = rowData;
        let colorStyle = "";
        let textColorStyle = "";
        let indicator = "";

        if(status){
            colorStyle = "bg-green-100";
            textColorStyle = "text-green-700";
            indicator = "Active";
        }else{
            colorStyle = "bg-red-100";
            textColorStyle = "text-red-700";
            indicator = "Inactive";
        }

        return <span className={`${colorStyle} ${textColorStyle} rounded-md px-2 text-sm font-semibold`}>{indicator}</span>
    }
    
    const dateFormat = (rowData) => {
        const { date } = rowData;
        if(date) return moment(date).format("LL");
    }

    const dateSecondFormat = (rowData) => {
        const { expectedArrival } = rowData;
        if(expectedArrival) return moment(expectedArrival).format("LL");
    }

    const dateThirdFormat = (rowData) => {
        const { dueDate, expectedArrival } = rowData;
        const [day, time] = moment(dueDate ? dueDate : expectedArrival).calendar().split("at");
        return <span className="text-yellow-700 font-semibold">{day}</span>;
    }

    const dateFourthFormat = (rowData) => {
        const { scheduledDate } = rowData;
        if(scheduledDate) return moment(scheduledDate).format("LL");
    }

    const paymentStatus = (rowData) => {
        const { payment } = rowData;
        let colorStyle = "";
        let textColorStyle = "";
        let indicator = "";

        if(payment === 1){
            colorStyle = "bg-red-100";
            textColorStyle = "text-red-700";
            indicator = "Not paid";
        }
        if(payment === 2){
            colorStyle = "bg-yellow-100";
            textColorStyle = "text-yellow-700";
            indicator = "Partially Paid";
        }
        if(payment === 3){
            colorStyle = "bg-green-100";
            textColorStyle = "text-green-700";
            indicator = "Paid";
        }

        return <span className={`${colorStyle} ${textColorStyle} rounded-md px-2 text-sm font-semibold`}>{indicator}</span>
    }
    
    const state = (rowData) => {
        const { state, supplier } = rowData;
        let colorStyle = "";
        let textColorStyle = "";
        let indicator = "";

        if(state === 1){
            colorStyle = "bg-yellow-100";
            textColorStyle = "text-yellow-700";
            indicator = "Pending";
        }
        if(formattedName === "bill" && state === 1){
            colorStyle = "bg-green-100";
            textColorStyle = "text-green-700";
            indicator = "Posted";
        }
        if(state === 2){
            colorStyle = "bg-blue-100";
            textColorStyle = "text-blue-700";
            indicator = "In Progress";
        }
        if(formattedName === "bill" && state === 2){
            colorStyle = "bg-red-100";
            textColorStyle = "text-red-700";
            indicator = "Cancelled";
        }
        if(state >= 3){
            colorStyle = "bg-green-100";
            textColorStyle = "text-green-700";
            indicator = "Done";
        }
        if(state === 4){
            colorStyle = "bg-red-100";
            textColorStyle = "text-red-700";
            indicator = "Cancelled";
        }
        if(op === "supply-chain" && supplier && state === 3){
            colorStyle = "bg-cyan-100";
            textColorStyle = "text-cyan-700";
            indicator = "Waiting bills";
        }
        if(op === "supply-chain" && supplier && state === 5){
            colorStyle = "bg-green-100";
            textColorStyle = "text-green-700";
            indicator = "Billed";
        }

        return <span className={`${colorStyle} ${textColorStyle} rounded-md px-2 text-sm font-semibold`}>{indicator}</span>
    }

    const orderState = (rowData) => {
        const { invoice, state, order } = rowData;
        let colorStyle = "";
        let textColorStyle = "";
        let indicator = "";
        
        if(formattedName === "order"){
            if(invoice === 1 ){
                colorStyle = "bg-yellow-100";
                textColorStyle = "text-yellow-700";
                indicator = "Pending";
            }
            if(invoice === 2){
                colorStyle = "bg-blue-100";
                textColorStyle = "text-blue-700";
                indicator = "To Invoice";
            }
            if(invoice === 3){
                colorStyle = "bg-green-100";
                textColorStyle = "text-green-700";
                indicator = "Done";
            }
        }

        if(formattedName === "shipment"){
            if(state === 1){
                colorStyle = "bg-yellow-100";
                textColorStyle = "text-yellow-700";
                indicator = "Pending";
            }
            if(state === 2){
                colorStyle = "bg-blue-100";
                textColorStyle = "text-blue-700";
                indicator = "Ready";
            }
            if(state === 3){
                colorStyle = "bg-green-100";
                textColorStyle = "text-green-700";
                indicator = "Ship";
            }
            if(state === 4){
                colorStyle = "bg-green-100";
                textColorStyle = "text-green-700";
                indicator = "Done";
            }
            if(order?.state === 5){
                colorStyle = "bg-red-100";
                textColorStyle = "text-red-700";
                indicator = "Cancelled";
            }
        }
        
        if(state === 5){
            colorStyle = "bg-red-100";
            textColorStyle = "text-red-700";
            indicator = "Cancelled";
        }

        return <span className={`${colorStyle} ${textColorStyle} rounded-md px-2 text-sm font-semibold`}>{indicator}</span>
    }

    const source = (rowData) => {
        const { reference, _id, product } = rowData;
        return <NavLink to={`/${op === "inventory" ? "inventory" : "supply-chain"}/${product ? "productions/production" : "purchases/purchase"}-form/${_id}`} className="text-blue-400">{reference}</NavLink>
    }

    const reOrder = async (values) => {
        let duplicate = false;
        let good = false;
        let rawMats = [];

        rawMaterials?.map(raw => { 
            components?.map(com => {
                if(raw._id === com.rawId) rawMats = [...rawMats, raw];            
            })
        });

        const computedQty = components?.map(com => ({...com, qty: com.qty * values.quantity}));
            
        computedQty.map(comQty => {
            rawMats.map(raw => {
                if(raw.quantity < comQty.qty){
                    good = true;
                }
            })
        })
        
        productions?.map(prod => {
            if(prod.product._id === values.product._id && (prod.state === 1 || prod.state === 2)){
                duplicate = true
            }
        })

        if(good){
            return toast.error("Failed to produce. Insufficient raw materials.", { position: toast.POSITION.TOP_RIGHT });
        }

        if(duplicate){
            return toast.error("Production order already issued for this product.", { position: toast.POSITION.TOP_RIGHT });
        }

        if(values?.product){
            const random = `P-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}`;
            const { product, quantity } = values;
            const response = await axios.post("/erp/add_production", { product, quantity, date: Date.now(), automate: false, reference: random });
            if(response.statusText === "OK"){
                return toast.success("Item re-order successfully.", { position: toast.POSITION.TOP_RIGHT });
            }else{
                return toast.error("Failed to re-order this item.", { position: toast.POSITION.TOP_RIGHT });
            }
        }else{
            const { supplier, materials, total } = values;
            const expected = new Date();
            const expectedData = expected.setDate(expected.getDate() + 2);
            const response = await axios.post("/erp/add_purchase", { supplier, date: Date.now(), expectedArrival: expectedData, materials, total, automate: false });
            if(response.statusText === "OK"){
                return toast.success("Item re-order successfully.", { position: toast.POSITION.TOP_RIGHT });
            }else{
                return toast.error("Failed to re-order this item.", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    }

    const replenishActions = (rowData) => {
        return (
            <div className="flex gap-2">
                <div className="flex gap-4" onClick={() => reOrder(rowData)}>
                    <button className="flex gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        Re-order
                    </button>
                </div>
                <div className="text-gray-400">Automatic</div>
            </div>
        )
    }

    const itemType = (rowData) => {
        const { product } = rowData;
        return <span>{product ? "Product" : "Materials"}</span>
    } 

    const amountAndTotal = (rowData) => {
        const { amount, total } = rowData;
        return <span>{amount ? amount : total}</span>
    }

    const NewLink = () => {
        return <NavLink to={`${currentLocation}/${formattedName}-form`} className="btn-dark px-4">New</NavLink>;
    }

    return (
        <>
            <AdjustmentDialog 
                visible={visible}
                setVisible={setVisible}
                itemData={selectedRows}
                setAction={setAction}
            />
            <div className="pt-14 px-4 flex gap-3 items-center justify-between py-3 border border-t-0 border-b-gray-200 bg-white">
                <div className="flex gap-3 items-center">
                    {   
                        op === "inventory" && 
                        formattedName !== "adjustment" && 
                        formattedName !== "replenishment" &&
                        <NewLink />
                    }   
                    {
                        op === "supply-chain" &&
                        formattedName !== "replenishment" &&
                        formattedName !== "product" && 
                        formattedName !== "raw-material" && 
                        <NewLink />
                    }
                    { 
                        formattedName === "user" ||
                        formattedName === "payment" ||
                        formattedName === "bill" ?
                        <NewLink /> : <></>
                    }
                    { 
                        op === "financial" && formattedName === "supplier" &&
                        <NewLink />
                    }
                    <span className="text-lg font-semibold">{`${name}s`}</span>
                </div>
                {
                    selectedRows?.length >= 0 &&
                    <TableActionsButtons 
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        setAction={setAction}
                        name={name}
                        setVisible={setVisible}
                    />
                }   
                {
                    selectedRows.length === 0 ?
                    <div className="w-1/4">
                        <div className="flex items-center bg-gray-100 pl-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6B7280" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input 
                                type="search" 
                                placeholder="Type to search"
                                className="searchBar" 
                                onChange={(e) => setFilters({global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS }})}
                            />
                        </div>
                    </div>
                    : 
                    <></>
                }
            </div>
            <DataTable
                paginator
                rows={10}
                paginatorTemplate={"PrevPageLink CurrentPageReport NextPageLink"}
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                filters={filters}
                value={dataValue}
                globalFilterFields={columns.map((item) => (item.filter))}
                selection={selectedRows}
                onSelectionChange={(e) => setSelectedRows(e.value)}
                dataKey="_id"
                tableStyle={{ minWidth: "40rem" }}
            >
                {columns.map((item, idx) => (
                    <Column
                        selectionMode={item.selectionMode ? "multiple" : ""}
                        body={
                            item.body === "isActive" ?
                            isActive : 
                            item.body === "image" ? 
                            imageTemplate : 
                            item.body === "quantityStatus" ? 
                            quantityStatus : 
                            item.body === "dateFormat" ?
                            dateFormat :
                            item.body === "dateSecondFormat" ?
                            dateSecondFormat :
                            item.body === "dateThirdFormat" ?
                            dateThirdFormat :
                            item.body === "dateFourthFormat" ?
                            dateFourthFormat :
                            item.body === "state" ? 
                            state :
                            item.body === "paymentStatus" ? 
                            paymentStatus :
                            item.body === "replenishActions" ?
                            replenishActions :
                            item.body === "amountAndTotal" ?
                            amountAndTotal :
                            item.body === "orderState" ?
                            orderState : 
                            item.body === "addressFormat" ?
                            addressFormat : 
                            item.body === "source" ?
                            source : null 
                        }
                        field={
                            item.field === "itemType" ?
                            itemType : item.field
                        }
                        header={item.header}
                        key={idx}
                    />
                ))}
            </DataTable>
        </>
    );
};

export default CustomTable;
