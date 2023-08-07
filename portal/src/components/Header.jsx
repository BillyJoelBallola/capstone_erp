import React, { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';
import DialogBox from './DialogBox';
import SideCart from './SideCart';
import axios from 'axios';

const Header = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const [dialogVisble, setDialogVisble] = useState(false);
    const [visible, setVisible] = useState(false);
    const { currentCustomer, setUpdate, setCurrentCustomer, cart, setCart, setCartAction, setBuyNowData } = useContext(CustomerContext);

    const openCart = () => {
        if(currentCustomer){
            setVisible(true);
        }else{
            navigate("/login");
        }
    }

    const cancelCheckOut = () => {
        const newCart = cart?.cart?.map(item => {
            return {
                ...item,
                select: false,
            };
        })
        setCart(prev => ({ ...prev, cart: newCart }));
        setBuyNowData({});
        setCartAction("cancel_checkOut")
    }

    const buttonFuction = () => {
        navigate("/");
        cancelCheckOut();
        setDialogVisble(false);
    }

    const HomeLink = () => {
        if(path.includes("check_out")){
            return (
                <button className='font-semibold text-md grid text-start' onClick={() => setDialogVisble(true)}>
                    <span>CUSTOMER</span>
                    <span className='-mt-2'>PORTAL</span>
                </button>
            )
        }else{
            return (
                <NavLink to="/" className='font-semibold text-md grid'>
                    <span>CUSTOMER</span>
                    <span className='-mt-2'>PORTAL</span>
                </NavLink > 
            )
        }
    }

    const AccountLink = () => {
        if(path.includes("check_out")){
            return (
                <button className='flex items-center gap-1' onClick={() => setDialogVisble(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className='hidden md:block'>Account</span>
                </button> 
            )
        }else{
            return (
                <NavLink to={`${currentCustomer ? "/account/purchase" : "/login"}`} className='flex items-center gap-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className='hidden md:block'>Account</span>
                </NavLink> 
            )
        }
    }

    return (
        <>
            <SideCart
                visible={visible}
                setVisible={setVisible}    
            />
            <DialogBox
                visible={dialogVisble}
                setVisible={setDialogVisble}
                func={buttonFuction}
            />
            <header className='w-screen bg-white fixed border border-t-0 border-x-0 z-10'>
                <div className='bg-gradient-to-r from-[#e02c4d] to-[#d73b6c] border border-x-0 border-t-0'>
                    <div className='side-margin text-white font-semibold text-xs py-1 flex items-center justify-between'>
                        <span>MICAELLA'S MEAT PRODUCTS</span>      
                        <div className='flex gap-4'>
                            <div className='flex gap-1 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>+63 905 164 3531</span>
                            </div>
                            {
                                !currentCustomer &&
                                <div className='flex gap-3'>
                                    <NavLink to="/login">Login</NavLink>
                                    <NavLink to="/register">Register</NavLink>
                                </div>
                            }
                        </div> 
                    </div>
                </div>
                <div className='side-margin py-2 flex items-center justify-between'>
                    <HomeLink />
                    <div className='flex items-center'>
                        <div className='flex gap-4 items-center text-sm'>
                            {
                                !path.includes("check_out") &&
                                <button className='flex items-center gap-1' onClick={openCart}>
                                    {cart?.cart?.length > 0 && <div className='text-white bg-darker rounded-lg text-xs min-w-max px-2'>{cart?.cart?.length}</div>}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                    <span className='hidden md:block'>Cart</span>
                                </button>
                            }
                            <AccountLink />
                            { 
                                currentCustomer &&
                                <button 
                                    className='flex items-center gap-1' 
                                    onClick={() => {
                                        axios.post("/erp/customer_logout")
                                        navigate("/")
                                        setUpdate("logout")
                                        setCurrentCustomer("")
                                        cancelCheckOut()
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                    <span className='hidden md:block'>Logout</span>
                                </button> 
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;