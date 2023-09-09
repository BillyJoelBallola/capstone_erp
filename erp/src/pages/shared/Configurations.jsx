import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import humanResouceIcon from "../../assets/human_resource.svg";
import supplyChainIcon from "../../assets/supply_chain.svg";
import inventoryIcon from "../../assets/inventory.svg";
import { NavLink, useParams } from 'react-router-dom';
import settingsIcon from "../../assets/settings.svg";
import financialIcon from "../../assets/finance.svg";
import portalIcon from "../../assets/portal.svg";
import { Tooltip } from 'primereact/tooltip';

// seperate the components for every modules, and create functions

const InventoryConfiguration = ({ inventorySettings, setInventorySettings, storage, setStorage, addStorage, removeItems }) => {
    return (
        <div className='flex gap-8 pt-4'>
            <div className='w-full grid gap-4'>
                <div className='grid gap-2'>
                    <div className='text-lg font-semibold'>
                        <span>Stock Indicators</span>
                        <Tooltip target=".product-info" />
                        <span className="pl-1 font-semibold text-gray-400 product-info" data-pr-tooltip={`Minimum: This value will be used for inventory indicator\nto determine whether the product quantity is insufficient.\nMaximum: This value will be used for inventory indicator\nto determine whether the product quantity is over stock.`}>?</span>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="form-group">
                            <label htmlFor="">Minimum</label>
                            <input 
                                type="number"
                                value={inventorySettings.productMin ? inventorySettings.productMin : ""}
                                onChange={(e) => setInventorySettings(prev => ({...prev, productMin: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Maximum</label>
                            <input
                                type="number"
                                value={inventorySettings.productMax ? inventorySettings.productMax : ""}
                                onChange={(e) => setInventorySettings(prev => ({...prev, productMax: Number(e.target.value) }))}
                            />
                        </div>
                    </div>
                </div>
                <div className='grid gap-2'>
                    <div className='text-lg font-semibold'>
                        <span>Production Quantity</span>
                        <Tooltip target=".product-info" />
                        <span className="pl-1 font-semibold text-gray-400 product-info" data-pr-tooltip={`Minimum: This value will use for reorder point.`}>?</span>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="form-group">
                            <label htmlFor="">Minimum</label>
                            <input 
                                type="number"
                                value={inventorySettings.productionMin ? inventorySettings.productionMin : ""}
                                onChange={(e) => setInventorySettings(prev => ({...prev, productionMin: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                <span className='text-lg font-semibold'>Storages</span>
                <div className='flex items-center gap-2 mt-4'>
                    <input 
                        type="text" 
                        placeholder='e.g Storage 1'
                        value={storage}
                        onChange={(e) => setStorage(e.target.value)}
                    />
                    <div>
                        <button className='bg-dark p-1 rounded-md' onClick={addStorage}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='grid gap-3 mt-4 bg-gray-100 py-2 px-4 border border-x-0 border-gray-300'>
                    {
                        inventorySettings?.storage?.length !== 0 ?
                        inventorySettings?.storage?.map((storage, idx) => (
                            <div className='flex justify-between items-center' key={idx}>
                                <span>{storage}</span>
                                <button onClick={() => removeItems(idx, inventorySettings.storage)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                        :
                        <div>
                            <span>No items yet.</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

const SupplyChainConfiguration = () => {
    return (
        <div>
            Supply Chain
        </div>
    )
}

const FinancialConfiguration = () => {
    return (
        <div>
            Financial
        </div>
    )
}

const HumanResourceConfiguration = () => {
    return (
        <div>
            Human Resource
        </div>
    )
}

const SalesConfiguration = () => {
    return (
        <div>
            Sales
        </div>
    )
}

const GeneralConfiguration = () => {
    return (
        <div>
            Settings
        </div>
    )
}

const Configurations = () => {
    const tab = useParams().tab;
    const op = useParams().op;
    const { settings } = useContext(UserContext);
    const [storage, setStorage] = useState("");
    const [inventorySettings, setInventorySettings] = useState({
        productMax: 0,
        productMin: 0,
        productionMin: 0,
        storage: []
    });

    useEffect(() => {
        if(settings){
            setInventorySettings({
                productMax: settings?.inventory?.productMax,
                productMin: settings?.inventory?.productMin,
                storage: settings?.inventory?.storage,
                productionMin: settings?.shared?.productionMin,
            })
        }
    }, [settings])

    const addStorage = () => {
        if(storage === "") return;
        setInventorySettings(prev => ({...prev, storage: [...prev.storage, storage]}));
        setStorage("");
    }

    const removeItems = (idx, array) => {
        const newArray = [...array];
        newArray.splice(idx, 1);
        setInventorySettings(prev => ({...prev, storage: newArray}));
    }

    // const saveChanges = () => {

    // }

    return (
        <>
            <ToastContainer draggable={false} hideProgressBar={true} />
            <div className="z-10 fixed left-0 right-0 px-4 pt-14 flex items-center gap-2 py-4 border-0 border-b border-b-gray-200 bg-white">
                <button className='btn-dark px-4'>Save</button>
                <span className="md:text-lg font-semibold">Settings</span>
            </div>
            <div className='flex h-screen'>
                <aside className='bg-dark flex flex-col gap-1 pt-28 pb-10 w-[15%] left-0 bottom-0 top-0 fixed text-white'>
                    { op === "settings" &&
                        <NavLink className={`${tab === 'general' && 'bg-[#444444]'} flex items-center gap-2 py-2 px-3 text-sm`} to={`/settings/general`}>
                            <div className="w-6 aspect-square grid place-items-center">
                                <img src={settingsIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className='text-white'>General Settings</span>
                        </NavLink>
                    }
                    { (tab === "inv-config" || op === "settings") && 
                        <NavLink className={`${tab === 'inv-config' && 'bg-[#444444]'} flex items-center gap-2 py-2 px-3 text-sm`} to={op === 'settings' ? '/settings/inv-config' : `/inventory/configurations/inv-config`}>
                            <div className="w-6 aspect-square grid place-items-center">
                                <img src={inventoryIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className='text-white'>Inventory</span>
                        </NavLink>    
                    }
                    { (tab === "sc-config" || op === "settings")  && 
                        <NavLink className={`${tab === 'sc-config' && 'bg-[#444444]'} flex items-center gap-2 py-2 px-3 text-sm`} to={op === 'settings' ? '/settings/sc-config' : `/supply-chain/configurations/sc-config`}>
                            <div className="w-6 aspect-square grid place-items-center">
                                <img src={supplyChainIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className='text-white'>Supply Chain</span>
                        </NavLink>    
                    }
                    { (tab === "hr-config" || op === "settings")  && 
                        <NavLink className={`${tab === 'hr-config' && 'bg-[#444444]'} flex items-center gap-2 py-2 px-3 text-sm`} to={op === 'settings' ? '/settings/hr-config' : `/human-resource/configurations/hr-config`}>
                            <div className="w-6 aspect-square grid place-items-center">
                                <img src={humanResouceIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className='text-white'>Human Resource</span>
                        </NavLink>    
                    }
                    { (tab === "fn-config" || op === "settings")  && 
                        <NavLink className={`${tab === 'fn-config' && 'bg-[#444444]'} flex items-center gap-2 py-2 px-3 text-sm`} to={op === 'settings' ? '/settings/fn-config' : `/financial/configurations/fn-config`}>
                            <div className="w-6 aspect-square grid place-items-center">
                                <img src={financialIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className='text-white'>Financial</span>
                        </NavLink>    
                    }
                    { (tab === "sl-config" || op === "settings")  && 
                        <NavLink className={`${tab === 'sl-config' && 'bg-[#444444]'} flex items-center gap-2 py-2 px-3 text-sm`} to={op === 'settings' ? '/settings/sl-config' : `/sales/configurations/sl-config`}>
                            <div className="w-6 aspect-square grid place-items-center">
                                <img src={portalIcon} alt="icon" className="object-contain" />
                            </div>
                            <span className='text-white'>Sales</span>
                        </NavLink>    
                    }
                </aside>
                <div className='pt-28 pb-10 px-4 ml-auto w-[85%] bg-white'>
                    { 
                        tab === "inv-config" && 
                        <InventoryConfiguration 
                            inventorySettings={inventorySettings}
                            setInventorySettings={setInventorySettings}
                            storage={storage}
                            setStorage={setStorage}
                            addStorage={addStorage}
                            removeItems={removeItems}
                        />
                    }
                    { tab === "sc-config" && <SupplyChainConfiguration />}
                    { tab === "fn-config" && <FinancialConfiguration />}
                    { tab === "hr-config" && <HumanResourceConfiguration />}
                    { tab === "sl-config" && <SalesConfiguration />}
                    { tab === "general" && <GeneralConfiguration />}
                </div>
            </div>
        </>
    )
}

export default Configurations;