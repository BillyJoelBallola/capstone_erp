import React, { useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TieredMenu } from "primereact/tieredmenu";
import settingsIcon from "../assets/settings.svg";
import dashboardIcon from "../assets/dashboard.svg";
import inventoryIcon from "../assets/inventory.svg";
import humanResouceIcon from "../assets/human_resource.svg";
import supplyChainIcon from "../assets/supply_chain.svg";
import portalIcon from "../assets/portal.svg";
import financialIcon from "../assets/finance.svg";
import arrowBack from "../assets/arrow.svg";

const DynamicLinks = () => {
    const navigate = useNavigate();
    const path = useLocation().pathname.split("/");
    const [hoverLogo, setHoverLogo] = useState(false);
    const menuFinancialCustomers = useRef(null);
    const menuFinancialSuppliers = useRef(null);
    const menuFinancial = useRef(null);
    const menuFinancialReports = useRef(null);
    const menuInventoryProducts = useRef(null);
    const menuInventoryOperations = useRef(null);
    const menuInventoryReport = useRef(null);
    const menuSalesOperations = useRef(null);   
    const menuSupplyChainProducts = useRef(null);
    const menuSupplyChainOperations = useRef(null);
    const menuSupplyChainReports = useRef(null);   

    // financial
    const financialCustomersMenu = [
        {
            label: "Invoices",
        },
        {
            label: "Payments",
        },
        {
            label: "Customers",
        }
    ];

    const financialSuppliersMenu = [
        {
            label: "Bills",
            command: () => navigate("/financial/bills")
        },
        {
            label: "Payments",
            command: () => navigate("/financial/payments")
        },
        {
            label: "Suppliers",
            command: () => navigate("/financial/suppliers")
        }
    ];

    const financialMenu = [
        {
            label: "Journal Entries",
            command: () => navigate("/financial/journal_entries")
        },
    ];

    const financialReportMenu = [
        {
            label: "General Ledger",
        },
        {
            label: "Journal Report",
        },
    ];

    // supply chain
    // const supplyChainProductsMenu = [
    //     {
    //         label: "Products",
    //         command: () => navigate("/supply-chain/products"),
    //     },
    //     {
    //         label: "Raw Materials",
    //         command: () => navigate("/supply-chain/raw-materials"),
    //     }
    // ];

    const supplyChainOperations = [
        {
            label: "Shipments",
            command: () => navigate("/supply-chain/shipments"),
        },
        {
            label: "Procurement",
            items: [
                {
                    label: "Productions",
                    command: () => navigate("/supply-chain/productions"),
                },
                {
                    label: "Purchase",
                    command: () => navigate("/supply-chain/purchases"),
                },
                {
                    label: "Replenishments",
                    command: () => navigate("/supply-chain/replenishment"),
                },
            ],
        },
    ]

    const supplyChainReportMenu = [
        {
            label: "Production Report",
        },
        {
            label: "Purchase Report",
        },
    ];

    // inventory
    const inventoryProductsMenu = [
        {
            label: "Products",
            command: () => navigate("/inventory/products"),
        },
        {
            label: "Raw Materials",
            command: () => navigate("/inventory/raw-materials"),
        }
    ];

    const inventoryOperations = [
        {
            label: "Adjustments",
            command: () => navigate("/inventory/adjustments"),
        },
        {
            label: "Procurement",
            items: [
                {
                    label: "Productions",
                    command: () => navigate("/inventory/productions"),
                },
                {
                    label: "Purchase",
                    command: () => navigate("/inventory/purchases"),
                },
                {
                    label: "Replenishments",
                    command: () => navigate("/inventory/replenishment"),
                },
            ],
        },
    ]

    const inventoryReportMenu = [
        {
            label: "Inventory Report",
            command: () => navigate("/inventory/inventory_report")
        },
    ];

    switch (path[1]) {
        case "":
            return (
                <div className="grid">
                    <span className="text-xl font-bold tracking-tight">
                        ERP SYSTEM
                    </span>
                    <span className="text-xs font-semibold -mt-1 tracking-tight">
                        MICAELLA'S MEAT PRODUCTS
                    </span>
                </div>
            );
        case "settings":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : settingsIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">Settings</span>
                    </NavLink>
                    <ul className="flex gap-3 header-link text-sm font-semibold">
                        <NavLink to="/settings">General Settings</NavLink>
                        <NavLink to="/settings/manage-users">
                            Manage Users
                        </NavLink>
                    </ul>
                </div>
            );
        case "dashboard":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : dashboardIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">Dashboard</span>
                    </NavLink>
                </div>
            );
        case "inventory":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : inventoryIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">Inventory</span>
                    </NavLink>
                    <ul className="flex gap-3 header-link text-sm font-semibold">
                        <NavLink to="/inventory">Overview</NavLink>
                        <div>
                            <TieredMenu
                                model={inventoryProductsMenu}
                                popup
                                ref={menuInventoryProducts}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) => menuInventoryProducts.current.toggle(e)}
                            >
                                Products
                            </button>
                        </div>
                        <div>
                            <TieredMenu
                                model={inventoryOperations}
                                popup
                                ref={menuInventoryOperations}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) => menuInventoryOperations.current.toggle(e)}
                            >
                                Operations
                            </button>
                        </div>
                        <div>
                            <TieredMenu
                                model={inventoryReportMenu}
                                popup
                                ref={menuInventoryReport}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuInventoryReport.current.toggle(e)
                                }
                            >
                                Reporting
                            </button>
                        </div>
                        <NavLink to="/">Configuration</NavLink>
                    </ul>
                </div>
            );
        case "human-resource":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : humanResouceIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">
                            Human Resource
                        </span>
                    </NavLink>
                </div>
            );
        case "financial":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : financialIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">Financial</span>
                    </NavLink>
                    <ul className="flex gap-3 header-link text-sm font-semibold">
                        <NavLink to="/financial">Overview</NavLink>
                        <div>
                            <TieredMenu
                                model={financialCustomersMenu}
                                popup
                                ref={menuFinancialCustomers}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuFinancialCustomers.current.toggle(e)
                                }
                            >
                                Customers
                            </button>
                        </div>
                        <div>
                            <TieredMenu
                                model={financialSuppliersMenu}
                                popup
                                ref={menuFinancialSuppliers}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuFinancialSuppliers.current.toggle(e)
                                }
                            >
                                Suppliers
                            </button>
                        </div>
                        <div>
                            <TieredMenu
                                model={financialMenu}
                                popup
                                ref={menuFinancial}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuFinancial.current.toggle(e)
                                }
                            >
                                Financial
                            </button>
                        </div>
                        <div>
                            <TieredMenu
                                model={financialReportMenu}
                                popup
                                ref={menuFinancialReports}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuFinancialReports.current.toggle(e)
                                }
                            >
                                Reporting
                            </button>
                        </div>
                        <NavLink to="/financial">Configuration</NavLink>
                    </ul>
                </div>
            );
        case "supply-chain":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : supplyChainIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">
                            Suppply Chain
                        </span>
                    </NavLink>
                    <ul className="flex gap-3 header-link text-sm font-semibold">
                        <NavLink to="/supply-chain">Overview</NavLink>
                        <NavLink to="/supply-chain/suppliers">Suppliers</NavLink>
                        {/* <div>
                            <TieredMenu
                                model={supplyChainProductsMenu}
                                popup
                                ref={menuSupplyChainProducts}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) => menuSupplyChainProducts.current.toggle(e)}
                            >
                                Inventory
                            </button>
                        </div> */}
                        <div>
                            <TieredMenu
                                model={supplyChainOperations}
                                popup
                                ref={menuSupplyChainOperations}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) => menuSupplyChainOperations.current.toggle(e)}
                            >
                                Operations
                            </button>
                        </div>
                        <div>
                            <TieredMenu
                                model={supplyChainReportMenu}
                                popup
                                ref={menuSupplyChainReports}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuSupplyChainReports.current.toggle(e)
                                }
                            >
                                Reporting
                            </button>
                        </div>
                        <NavLink to="/">Configuration</NavLink>
                    </ul>
                </div>
            );
        case "sales":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className="flex gap-3 items-center"
                        onMouseEnter={() => setHoverLogo(true)}
                        onMouseLeave={() => setHoverLogo(false)}
                        onClick={() => setHoverLogo(false)}
                    >
                        <div className="w-5 aspect-square grid place-items-center">
                            <img
                                src={hoverLogo ? arrowBack : portalIcon}
                                alt="icon"
                                className="object-contain"
                            />
                        </div>
                        <span className="font-semibold text-lg">
                            Sales
                        </span>
                    </NavLink>
                    <ul className="flex gap-3 header-link text-sm font-semibold">
                        <NavLink to="/sales">Customers</NavLink>
                        <NavLink to="/sales/orders">Orders</NavLink>
                        <NavLink to="/sales">Reporting</NavLink> 
                        <NavLink to="/sales">Configuration</NavLink> 
                    </ul>
                </div>
            );
        default:
            break;
    }
};

export default DynamicLinks;
