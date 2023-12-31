import React, { useContext, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import humanResouceIcon from "../assets/human_resource.svg";
import supplyChainIcon from "../assets/supply_chain.svg";
import attendanceIcon from "../assets/attendance.svg";
import { UserContext } from "../context/UserContext";
import { TieredMenu } from "primereact/tieredmenu";
import settingsIcon from "../assets/settings.svg";
import dashboardIcon from "../assets/dashboard.svg";
import inventoryIcon from "../assets/inventory.svg";
import financialIcon from "../assets/finance.svg";
import portalIcon from "../assets/portal.svg";

// TODO: Responsiveness of forms

const DynamicLinks = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const path = useLocation().pathname.split("/");
    const [navControl, setNavControl] = useState(false);
    const menuFinancialCustomers = useRef(null);
    const menuFinancialSuppliers = useRef(null);
    const menuFinancial = useRef(null);
    const menuFinancialReports = useRef(null);
    const menuInventoryProducts = useRef(null);
    const menuInventoryOperations = useRef(null);
    const menuInventoryReport = useRef(null);
    // const menuSalesOperations = useRef(null);   
    // const menuSupplyChainProducts = useRef(null);
    const menuSupplyChainOperations = useRef(null);
    const menuHumanResourceOperations = useRef(null);
    const menuSupplyChainReports = useRef(null);   
    const menuHumanResourceReports = useRef(null);
    const menuSalesReports = useRef(null);
    const menuHRReports = useRef(null);

    // Sales
    const salesReports = [
        {
            label: "Sales Report",
            command: () => navigate("/sales/sales_report")
        }
    ]

    // Human Resource
    const humanResouceOperationMenu = [
        {
            label: "Attendance",
            command: () => navigate("/human-resource/attendance")
        },
        {
            label: "Payslips",
            command: () => navigate("/human-resource/payslips")
        }
    ];
    const humanResouceReportMenu = [
        {
            label: "Attendance Report",
            command: () => navigate("/human-resource")
        },
        {
            label: "Payroll Report",
            command: () => navigate("/human-resource")
        }
    ];
    
    // financial
    const financialCustomersMenu = [
        {
            label: "Invoices",
            command: () => navigate("/financial/invoices")
        },
        {
            label: "Payments",
            command: () => navigate("/financial/payments/customers")
        },
        {
            label: "Customers",
            command: () => navigate("/financial/customers")
        }
    ];

    const financialSuppliersMenu = [
        {
            label: "Bills",
            command: () => navigate("/financial/bills")
        },
        {
            label: "Payments",
            command: () => navigate("/financial/payments/suppliers")
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
            command: () => navigate("/supply-chain/production_report")
        },
        {
            label: "Purchase Report",
            command: () => navigate("/supply-chain/purchase_report")
        },
        {
            label: "Shipment Report",
            command: () => navigate("/supply-chain/shipment_report")
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
            command: () => navigate("/inventory/inventory_report/products")
        },
        {
            label: "Adjustment Report",
            command: () => navigate("/inventory/adjustment_report")
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
                    <NavLink to="/" className="grid place-items-center">
                        <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                        </svg>
                    </NavLink>
                    <div className="flex gap-2 items-center">
                        <div className="w-5 aspect-square grid place-items-center">
                            <img src={settingsIcon} alt="icon" className="object-contain" />
                        </div>
                        <span className="font-semibold text-lg">Settings</span>
                    </div>
                    <ul className="flex gap-3 header-link text-sm">
                        <NavLink to="/settings/general">General Settings</NavLink>
                        <NavLink to="/settings/manage-users">
                            Manage Users
                        </NavLink>
                    </ul>
                </div>
            );
        case "dashboard":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink to="/" className="grid place-items-center">
                        <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                        </svg>
                    </NavLink>
                    <div className="flex gap-2 items-center">
                        <div className="w-5 aspect-square grid place-items-center">
                            <img src={dashboardIcon} alt="icon" className="object-contain" />
                        </div>
                        <span className="font-semibold text-lg">Dashboard</span>
                    </div>
                </div>
            );
        case "attendance":
            return (
                <div className="flex gap-5 items-center">
                    <NavLink to="/" className="grid place-items-center">
                        <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                        </svg>
                    </NavLink>
                    <div className="flex gap-2 items-center">
                        <div className="w-5 aspect-square grid place-items-center">
                            <img src={attendanceIcon} alt="icon" className="object-contain" />
                        </div>
                        <span className="font-semibold text-lg">Attendance</span>
                    </div>
                </div>
            );
        case "inventory":
            return (
                <div className="flex gap-5 md:items-center">
                    <div className="flex items-center gap-2 md:gap-5">
                        {
                            navControl ?
                            <button className="grid md:hidden place-items-center" onClick={() => setNavControl(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            :
                            <button className="block md:hidden" onClick={() => setNavControl(true)}>
                                <svg className="w-5 aspect-asquare" viewBox="0 0 77 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0.75H75C75.6904 0.75 76.25 1.30964 76.25 2V66C76.25 66.6904 75.6904 67.25 75 67.25H2C1.30964 67.25 0.75 66.6904 0.75 66V2C0.75 1.30965 1.30965 0.75 2 0.75Z" stroke="black" strokeWidth={4}/>
                                    <rect x="46" width="31" height="68" rx="2" fill="black"/>
                                </svg>
                            </button>
                        }
                        <NavLink to="/" className="grid place-items-center">
                            <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                            </svg>
                        </NavLink>
                        <div className="flex gap-1 md:gap-2 items-center">
                            <div className="w-5 aspect-square grid place-items-center">
                                <img src={inventoryIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className="font-semibold text-lg">Inventory</span>
                        </div>
                    </div>
                    {/* Web */}
                    <ul className="md:flex hidden p-2 gap-3 header-link text-sm">
                        <NavLink to="/inventory">Overview</NavLink>
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
                        {
                            currentUser?.userAccess[3]?.role === "Administrator" &&
                            <>
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
                                <NavLink to="/inventory/configurations/inv-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                     {/* Mobile */}
                    <ul className={`md:hidden flex bg-white absolute top-10 flex-col h-screen ${navControl ? 'left-0 w-1/2' : '-left-[100%]'} drop-shadow-lg py-8 pl-4 pr-10 gap-5 header-link text-sm font-semibold duration-200`}>
                        <NavLink to="/inventory">Overview</NavLink>
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
                        {
                            currentUser?.userAccess[3]?.role === "Administrator" &&
                            <>
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
                                <NavLink to="/inventory/configurations/inv-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                </div>
            );
        case "human-resource":
            return (
                <div className="flex gap-5 items-center">
                    <div className="flex items-center gap-2 md:gap-5">
                        {
                            navControl ?
                            <button className="grid md:hidden place-items-center" onClick={() => setNavControl(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            :
                            <button className="block md:hidden" onClick={() => setNavControl(true)}>
                                <svg className="w-5 aspect-asquare" viewBox="0 0 77 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0.75H75C75.6904 0.75 76.25 1.30964 76.25 2V66C76.25 66.6904 75.6904 67.25 75 67.25H2C1.30964 67.25 0.75 66.6904 0.75 66V2C0.75 1.30965 1.30965 0.75 2 0.75Z" stroke="black" strokeWidth={4}/>
                                    <rect x="46" width="31" height="68" rx="2" fill="black"/>
                                </svg>
                            </button>
                        }
                        <NavLink to="/" className="grid place-items-center">
                            <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                            </svg>
                        </NavLink>
                        <div className="flex gap-2 items-center">
                            <div className="w-5 aspect-square grid place-items-center">
                                <img src={humanResouceIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className="font-semibold text-lg">Human Resource</span>
                        </div>
                    </div>
                    {/* Web */}
                    <ul className="md:flex hidden p-2 gap-3 header-link text-sm">
                        <NavLink to="/human-resource">Overview</NavLink>
                        <div>
                            <TieredMenu
                                model={humanResouceOperationMenu}
                                popup
                                ref={menuHumanResourceOperations}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuHumanResourceOperations.current.toggle(e)
                                }
                            >
                                Operations
                            </button>
                        </div>
                        <NavLink to="/human-resource/employees">Employees</NavLink>
                        {
                            currentUser?.userAccess[7]?.role === "Administrator" &&
                            <>
                                <div>
                                    <TieredMenu
                                        model={humanResouceReportMenu}
                                        popup
                                        ref={menuHumanResourceReports}
                                        breakpoint="767px"
                                        className="text-sm"
                                    />
                                    <button
                                        onClick={(e) =>
                                            menuHumanResourceReports.current.toggle(e)
                                        }
                                    >
                                        Reporting
                                    </button>
                                </div>
                                <NavLink to="/human-resource/configurations/hr-config">Configuration</NavLink> 
                            </>
                        }
                    </ul>
                    {/* Mobile */}
                    <ul className={`md:hidden flex bg-white absolute top-14 flex-col h-screen ${navControl ? 'left-0 w-1/2' : '-left-[100%]'} drop-shadow-lg py-6 pl-4 pr-10 gap-5 header-link text-sm font-semibold duration-200`}>
                        <NavLink to="/human-resource">Overview</NavLink>
                        <div>
                            <TieredMenu
                                model={humanResouceOperationMenu}
                                popup
                                ref={menuHumanResourceOperations}
                                breakpoint="767px"
                                className="text-sm"
                            />
                            <button
                                onClick={(e) =>
                                    menuHumanResourceOperations.current.toggle(e)
                                }
                            >
                                Operations
                            </button>
                        </div>
                        <NavLink to="/human-resource/employees">Employees</NavLink>
                        {
                            currentUser?.userAccess[7]?.role === "Administrator" &&
                            <>
                                <div>
                                    <TieredMenu
                                        model={humanResouceReportMenu}
                                        popup
                                        ref={menuHumanResourceReports}
                                        breakpoint="767px"
                                        className="text-sm"
                                    />
                                    <button
                                        onClick={(e) =>
                                            menuHumanResourceReports.current.toggle(e)
                                        }
                                    >
                                        Reporting
                                    </button>
                                </div>
                                <NavLink to="/human-resource/configurations/hr-config">Configuration</NavLink> 
                            </>
                        }
                    </ul>
                </div>
            );
        case "financial":
            return (
                <div className="flex gap-5 items-center">
                    <div className="flex items-center gap-2 md:gap-5">
                        {
                            navControl ?
                            <button className="grid md:hidden place-items-center" onClick={() => setNavControl(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            :
                            <button className="block md:hidden" onClick={() => setNavControl(true)}>
                                <svg className="w-5 aspect-asquare" viewBox="0 0 77 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0.75H75C75.6904 0.75 76.25 1.30964 76.25 2V66C76.25 66.6904 75.6904 67.25 75 67.25H2C1.30964 67.25 0.75 66.6904 0.75 66V2C0.75 1.30965 1.30965 0.75 2 0.75Z" stroke="black" strokeWidth={4}/>
                                    <rect x="46" width="31" height="68" rx="2" fill="black"/>
                                </svg>
                            </button>
                        }
                        <NavLink to="/" className="grid place-items-center">
                            <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                            </svg>
                        </NavLink>
                        <div className="flex gap-2 items-center">
                            <div className="w-5 aspect-square grid place-items-center">
                                <img src={financialIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className="font-semibold text-lg">Financial</span>
                        </div>
                    </div>
                    {/* Web */}
                    <ul className="md:flex hidden p-2 gap-3 header-link text-sm">
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
                        {
                            currentUser?.userAccess[5]?.role === "Administrator" &&
                            <>
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
                                <NavLink to="/financial/configurations/fn-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                    {/* Mobile */}
                    <ul className={`md:hidden flex bg-white absolute top-14 flex-col h-screen ${navControl ? 'left-0 w-1/2' : '-left-[100%]'} drop-shadow-lg py-6 pl-4 pr-10 gap-5 header-link text-sm font-semibold duration-200`}>
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
                        {
                            currentUser?.userAccess[5]?.role === "Administrator" &&
                            <>
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
                                <NavLink to="/financial/configurations/fn-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                </div>
            );
        case "supply-chain":
            return (
                <div className="flex gap-5 items-center">
                    <div className="flex items-center gap-2 md:gap-5">
                        {
                            navControl ?
                            <button className="grid md:hidden place-items-center" onClick={() => setNavControl(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            :
                            <button className="block md:hidden" onClick={() => setNavControl(true)}>
                                <svg className="w-5 aspect-asquare" viewBox="0 0 77 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0.75H75C75.6904 0.75 76.25 1.30964 76.25 2V66C76.25 66.6904 75.6904 67.25 75 67.25H2C1.30964 67.25 0.75 66.6904 0.75 66V2C0.75 1.30965 1.30965 0.75 2 0.75Z" stroke="black" strokeWidth={4}/>
                                    <rect x="46" width="31" height="68" rx="2" fill="black"/>
                                </svg>
                            </button>
                        }
                        <NavLink to="/" className="grid place-items-center">
                            <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                            </svg>
                        </NavLink>
                        <div className="flex gap-2 items-center">
                            <div className="w-5 aspect-square grid place-items-center">
                                <img src={supplyChainIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className="font-semibold text-lg">Supply Chain</span>
                        </div>
                    </div>
                    {/* Web */}
                    <ul className="md:flex hidden p-2 gap-3 header-link text-sm">
                        <NavLink to="/supply-chain">Overview</NavLink>
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
                        <NavLink to="/supply-chain/suppliers">Suppliers</NavLink>
                        {
                            currentUser?.userAccess[4]?.role === "Administrator" &&
                            <>
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
                                <NavLink to="/supply-chain/configurations/sc-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                    {/* Mobile */}
                    <ul className={`md:hidden flex bg-white absolute top-14 flex-col h-screen ${navControl ? 'left-0 w-1/2' : '-left-[100%]'} drop-shadow-lg py-6 pl-4 pr-10 gap-5 header-link text-sm font-semibold duration-200`}>
                        <NavLink to="/supply-chain">Overview</NavLink>
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
                        <NavLink to="/supply-chain/suppliers">Suppliers</NavLink>
                        {
                            currentUser?.userAccess[4]?.role === "Administrator" &&
                            <>
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
                                <NavLink to="/supply-chain/configurations/sc-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                </div>
            );
        case "sales":
            return (
                <div className="flex gap-5 items-center">
                     <div className="flex items-center gap-2 md:gap-5">
                        {
                            navControl ?
                            <button className="grid md:hidden place-items-center" onClick={() => setNavControl(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            :
                            <button className="block md:hidden" onClick={() => setNavControl(true)}>
                                <svg className="w-5 aspect-asquare" viewBox="0 0 77 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 0.75H75C75.6904 0.75 76.25 1.30964 76.25 2V66C76.25 66.6904 75.6904 67.25 75 67.25H2C1.30964 67.25 0.75 66.6904 0.75 66V2C0.75 1.30965 1.30965 0.75 2 0.75Z" stroke="black" strokeWidth={4}/>
                                    <rect x="46" width="31" height="68" rx="2" fill="black"/>
                                </svg>
                            </button>
                        }
                        <NavLink to="/" className="grid place-items-center">
                            <svg fill="#000000" className="w-4 h-4 hover:scale-[1.15] duration-150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z" fillRule="evenodd"/>
                            </svg>
                        </NavLink>
                        <div className="flex gap-2 items-center">
                            <div className="w-5 aspect-square grid place-items-center">
                                <img src={portalIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className="font-semibold text-lg">Sales</span>
                        </div>
                    </div>
                    {/* Web */}
                    <ul className="md:flex hidden p-2 gap-3 header-link text-sm">
                        <NavLink to="/sales">Overview</NavLink>
                        <NavLink to="/sales/customers">Customers</NavLink>
                        <NavLink to="/sales/orders">Orders</NavLink>
                        {
                            currentUser?.userAccess[6]?.role === "Administrator" &&
                            <>
                                <div>
                                    <TieredMenu
                                        model={salesReports}
                                        popup
                                        ref={menuSalesReports}
                                        breakpoint="767px"
                                        className="text-sm"
                                    />
                                    <button
                                        onClick={(e) => menuSalesReports.current.toggle(e)}
                                    >
                                        Reporting
                                    </button>
                                </div>
                                <NavLink to="/sales/configurations/sl-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                    {/* Mobile */}
                    <ul className={`md:hidden flex bg-white absolute top-14 flex-col h-screen ${navControl ? 'left-0 w-1/2' : '-left-[100%]'} drop-shadow-lg py-6 pl-4 pr-10 gap-5 header-link text-sm font-semibold duration-200`}>
                        <NavLink to="/sales">Overview</NavLink>
                        <NavLink to="/sales/customers">Customers</NavLink>
                        <NavLink to="/sales/orders">Orders</NavLink>
                        {
                            currentUser?.userAccess[6]?.role === "Administrator" &&
                            <>
                                <div>
                                    <TieredMenu
                                        model={salesReports}
                                        popup
                                        ref={menuSalesReports}
                                        breakpoint="767px"
                                        className="text-sm"
                                    />
                                    <button
                                        onClick={(e) => menuSalesReports.current.toggle(e)}
                                    >
                                        Reporting
                                    </button>
                                </div>
                                <NavLink to="/sales/configurations/sl-config">Configuration</NavLink>
                            </>
                        }
                    </ul>
                </div>
            );
        default:
            break;
    }
};

export default DynamicLinks;
