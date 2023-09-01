import React, { useEffect } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import placeHolder from "../../assets/placeholder.png";
import { Tooltip } from 'primereact/tooltip';
import emailjs from "@emailjs/browser";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = () => {
    const navigate = useNavigate();
    const id = useParams().id;

    const formik = useFormik({
        initialValues: {
            _id: "",
            userImage: "",
            name: "",
            email: "",
            role: false,
            status: true,
            dashboard: {
                name: "dashboard",
                access: false,
            },
            settings: {
                name: "settings",
                access: false,
            },
            inventory: {
                name: "inventory",
                access: true,
                role: "Administrator",
            },
            supplyChain: {
                name: "supply-chain",
                access: true,
                role: "Administrator",
            },
            financial: {
                name: "financial",
                access: true,
                role: "Administrator",
            },
            humanResource: {
                name: "human-resource",
                access: true,
                role: "Administrator",
            },
            sales: {
                name: "sales",
                access: true,
                role: "Administrator",
            }
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(5, "Name must be more than 5 characters.")
                .max(30, "Name must be 30 characters or less.")
                .required("Name is required."),
            email: Yup.string()
                .email("Invalid email address.")
                .required("Email is required.")
                .min(8, "Email is too short"),
        }),
        onSubmit: async (values) => {

            if(values.role === true){
                values.dashboard.access = true;
                values.settings.access = true;
            }
            if(
                values.inventory.access === false &&
                values.supplyChain.access === false &&
                values.humanResource.access === false &&
                values.sales.access === false &&
                values.financial.access === false
            ){
                return toast.error("Failed to add. user account must have atleast one[1] access right.", { position: toast.POSITION.TOP_RIGHT }); 
            }

            const userAccess = new Array(values.dashboard, values.settings, values.inventory, values.supplyChain, values.financial, values.sales, values.humanResource)
            
            if(id){
                const { data } = await axios.put("/erp/update_user", { _id: values._id, name: values.name, email: values.email, password: values.password, role: values.role, status: values.status, userAccess: userAccess, userImage: values.userImage});
                if(typeof data === "object"){
                    navigate(`/settings/manage-users/user-form/${data._id}`);
                    return toast.success("Account edited successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add user account.", { position: toast.POSITION.TOP_RIGHT });
                }
            }else{
                const [ tempPass, dom ] = values.email.split("@");
                const { data } = await axios.post("/erp/add_user", { name: values.name, email: values.email, password: tempPass, role: values.role, userAccess: userAccess, userImage: values.userImage});
                if(typeof data === "object"){
                    emailjs.send(
                        "service_i70az2c",
                        "template_4693ekx",
                        { 
                            name: values.name,
                            link: `http://localhost:5173/change_password/${tempPass}`,
                            to_email: values.email
                        },
                        "Ms1LVJ5aom_Nyf7ct"
                    ).then(res => {
                        return;
                    });
                    navigate(`/settings/manage-users/user-form/${data._id}`);
                    return toast.success("Account added successfully.", { position: toast.POSITION.TOP_RIGHT });
                }else{
                    return toast.error("Failed to add user account.", { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
    });

    useEffect(() => {
        if(id){
            axios.get(`/erp/user/${id}`).then(({data}) => {
                formik.values._id = data._id;
                formik.values.userImage = data.userImage;
                formik.values.name = data.name;
                formik.values.email = data.email;
                formik.values.password = data.password;
                formik.values.role = data.role === "Administrator" ? true : false;
                formik.values.status = data.status;
                formik.values.dashboard = data.userAccess[0];
                formik.values.settings = data.userAccess[1];
                formik.values.inventory = data.userAccess[2];
                formik.values.supplyChain = data.userAccess[3];
                formik.values.financial = data.userAccess[4];
                formik.values.humanResource = data.userAccess[5];
                formik.values.sales = data.userAccess[6];
            })
        }
    }, [])

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <div>
                <div className="fixed left-0 right-0 px-4 pt-14 flex gap-3 items-center py-4 border-0 border-b border-b-gray-200 bg-white">
                    <button type="submit" className="btn-outlined px-4" form="user-form">
                        {id ? "Edit" : "Save"}
                    </button>
                    <div className="grid justify-center">
                        <span className="text-lg font-semibold">User</span>
                        <span className="text-sm font-semibold -mt-2">{id ? "Edit" : "New"}</span>
                    </div>
                </div>
                <div className="px-6 py-8 pt-32 bg-gray-100">
                    <form className="p-4 border grid gap-8 bg-white" id="user-form" onSubmit={formik.handleSubmit}>
                        <div className="flex justify-between">
                            <div className="grid gap-4 w-2/3">
                                <div className="form-group">
                                    <label htmlFor="" className={`${formik.touched.name && formik.errors.name ? "text-red-400" : ""}`}>
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Name"}
                                    </label>    
                                    <input
                                        autoFocus
                                        type="text"
                                        style={{ fontSize: "larger", fontWeight: 600 }}
                                        placeholder="e.g. Juan Dela Cruz"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="form-group">
                                    <Tooltip target=".email-info" />
                                    <label htmlFor="" className={`${formik.touched.email && formik.errors.email ? "text-red-400" : ""}`}>
                                        {formik.touched.email && formik.errors.email ? formik.errors.email : "Email"}
                                        <span className="pl-1 font-semibold text-gray-400 email-info" data-pr-tooltip={`Email address should be existing.`}>?</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="e.g. juandelacruz@gmail.com"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>
                            <div className="h-32 aspect-square border">
                                <img
                                    src={placeHolder}
                                    alt="user-image"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl">Access Rights</span>
                            <div className="mt-6 grid grid-cols-2 gap-10">
                                {/* left */}
                                <div className="flex flex-col gap-10">
                                    <div className="grid gap-2">
                                        <Tooltip target=".inventory-info" />
                                        <div className="flex items-center justify-between border-b border-b-gray-300 py-2">
                                            <div className="font-semibold">
                                                Inventory
                                                <span className="pl-1 font-semibold text-gray-400 inventory-info" data-pr-tooltip={`For 'User' access level: Reporting and configuration of inventory are restricted.`}>?</span>
                                            </div>
                                            <InputSwitch
                                                name="inventory.access"
                                                checked={formik.values.inventory.access}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.values.inventory.access && (
                                            <div className="flex items-center gap-5">
                                                <label htmlFor="">Access</label>
                                                <select
                                                    name="inventory.role"
                                                    value={formik.values.inventory.role}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                >
                                                    <option value="Administrator">Administrator</option>
                                                    <option value="User">User</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Tooltip target=".hr-info" />
                                        <div className="flex items-center justify-between border-b border-b-gray-300 py-2">
                                            <div className="font-semibold">
                                                <span>Human Resource</span>
                                                <span className="pl-1 font-semibold text-gray-400 hr-info" data-pr-tooltip={`For 'User' access level: Reporting and configuration of human resource are restricted.`}>?</span>
                                            </div>
                                            <InputSwitch
                                                name="humanResource.access"
                                                checked={formik.values.humanResource.access}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.values.humanResource.access && (
                                            <div className="flex items-center gap-5">
                                                <label htmlFor="">Access</label>
                                                <select
                                                    name="humanResource.role"
                                                    value={
                                                        formik.values.humanResource.role
                                                    }
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="Administrator">Administrator</option>
                                                    <option value="User">User</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Tooltip target=".sys-info" />
                                        <div className="flex items-center justify-between py-2">
                                            <div className="font-semibold">
                                                Sytem Administrator
                                                <span className="pl-1 font-semibold text-gray-400 sys-info" data-pr-tooltip="System administrator is allowed to access general settings and user management">?</span>
                                            </div>
                                            <InputSwitch
                                                name="role"
                                                checked={formik.values.role}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* right */}
                                <div className="flex flex-col gap-10">
                                    <div className="grid gap-2">
                                        <Tooltip target=".supply-info" />
                                        <div className="flex items-center justify-between border-b border-b-gray-300 py-2">
                                            <div className="font-semibold">
                                                <span>Supply Chain</span>
                                                <span className="pl-1 font-semibold text-gray-400 supply-info" data-pr-tooltip="For 'User' access level: Reporting and configuration of supply chain are restricted.">?</span>
                                            </div>
                                            <InputSwitch
                                                name="supplyChain.access"
                                                checked={
                                                    formik.values.supplyChain.access
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.values.supplyChain.access && (
                                            <div className="flex items-center gap-5">
                                                <label htmlFor="">Access</label>
                                                <select
                                                    name="supplyChain.role"
                                                    value={formik.values.supplyChain.role}
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="Administrator">Administrator</option>
                                                    <option value="User">User</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Tooltip target=".finance-info" />
                                        <div className="flex items-center justify-between border-b border-b-gray-300 py-2">
                                            <div className="font-semibold">
                                                <span>Financial</span>
                                                <span className="pl-1 font-semibold text-gray-400 finance-info" data-pr-tooltip="For 'User' access level: Reporting and configuration of financial are restricted.">?</span>
                                            </div>
                                            <InputSwitch
                                                name="financial.access"
                                                checked={formik.values.financial.access}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.values.financial.access && (
                                            <div className="flex items-center gap-5">
                                                <label htmlFor="">Access</label>
                                                <select
                                                    name="financial.role"
                                                    value={formik.values.financial.role}
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="Administrator">Administrator</option>
                                                    <option value="User">User</option>
                                                </select>
                                            </div>
                                        )}
                                        {formik.values.financial.role === "User" && <div className="text-sm text-gray-400">For 'User' access level: Reporting and configuration of financial are restricted.</div>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Tooltip target=".sales-info" />
                                        <div className="flex items-center justify-between border-b border-b-gray-300 py-2">
                                            <div className="font-semibold">
                                                <span>Sales</span>
                                                <span className="pl-1 font-semibold text-gray-400 sales-info" data-pr-tooltip="For 'User' access level: Reporting and configuration of sales are restricted.">?</span>
                                            </div>
                                            <InputSwitch
                                                name="sales.access"
                                                checked={formik.values.sales.access}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                        {formik.values.sales.access && (
                                            <div className="flex items-center gap-5">
                                                <label htmlFor="">Access</label>
                                                <select
                                                    name="sales.role"
                                                    value={formik.values.sales.role}
                                                    onChange={formik.handleChange}
                                                >
                                                    <option value="Administrator">Administrator</option>
                                                    <option value="User">User</option>
                                                </select>
                                            </div>
                                        )}
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

export default UserForm;
