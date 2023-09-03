import React, { useContext, useEffect, useState } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { formatMoney } from '../static/_functions';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { toast } from "react-toastify";
import axios from 'axios';

const SideCart = ({ visible, setVisible }) => {
    const navigate = useNavigate();
    const { cart, setCart, setCartAction } = useContext(CustomerContext);
    const [products, setProducts] = useState([]);
    const [readyForCheckOut, setReadyForCheckOut] = useState([]);
    const [disableButton, setDisableButton] = useState({
        save: false,
        remove: false,
    });

    useEffect(() => {
        const selected = cart?.cart?.filter(item => (item.select === true));
        setReadyForCheckOut(selected);
    }, [cart])

    useEffect(() => {
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data);
        })
    }, [])

    const removeCartItem = async (idx) => {
        setDisableButton(prev => ({...prev, remove: true}));
        const response = await axios.put("/erp/remove_cart_item", { id: cart._id, index: idx });
        if(response.statusText === "OK"){
            setCartAction("removeItem");
            setDisableButton(prev => ({...prev, remove: false}));
            return toast.success("Item remove successfully.", { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Failed to remove item.", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    const saveChanges = async (idx) => {
        setDisableButton(prev => ({...prev, save: true}));
        const newCart = [...cart.cart];
        const productData = products.find(item => item._id === newCart[idx].productId);
        cancelCheckOut();
        
        // if(newCart[idx].quantity >= productData?.quantity){
        //     return toast.warning("Quantity must be less than to avalable items", {  position: toast.POSITION.TOP_RIGHT });
        // }
        
        if(newCart[idx].quantity <= 0){
            return toast.warning("Quantity must be 1 or more", {  position: toast.POSITION.TOP_RIGHT });
        }
        
        const response = await axios.put("/erp/change_cart_item", { id: cart._id, cart: newCart });
        if(response.statusText === "OK"){
            setDisableButton(prev => ({...prev, save: false}));
            return toast.success("Save changes successfully", {  position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Failed to save changes", {  position: toast.POSITION.TOP_RIGHT });
        }
    }

    const quantityControlButton = (idx, action) => {
        const newCart = [...cart.cart];
       
        switch(action){
            case "add":
                newCart[idx].quantity += 1;
                break;
            case "minus":
                if(newCart[idx].quantity === 1) return;
                newCart[idx].quantity -= 1;
                break;
        }

        newCart[idx].totalPrice = newCart[idx].productPrice * newCart[idx].quantity;
        setCart(prev => ({ ...prev, cart: newCart }));
    }

    const handleQuantityChange = (e, idx) => {
        const newCart = [...cart.cart];
        let qty = e.target.value;

        if(qty === "") {
            newCart[idx].quantity = qty;
            newCart[idx].totalPrice = newCart[idx].productPrice;
        }else{
            newCart[idx].quantity = Number(qty);
            newCart[idx].totalPrice = newCart[idx].productPrice * newCart[idx].quantity;
        }

        setCart(prev => ({ ...prev, cart: newCart }));
    };

    const selectItemToCheckOut = (idx) => {
        const newCart = [...cart.cart];
        if(newCart[idx].select === false){
            newCart[idx].select = true;
        }else{
            newCart[idx].select = false;
        }
        setCart(prev => ({ ...prev, cart: newCart }));
    }

    const cancelCheckOut = () => {
        const newCart = cart?.cart?.map(item => {
            return {
                ...item,
                select: false,
            };
        })
        setCart(prev => ({ ...prev, cart: newCart }));
    }

    const TotatCheckOut = () => {
        let total = 0;
        if(readyForCheckOut.length > 0){
            readyForCheckOut.map(item => {
                total += item.totalPrice;
            })
        }
        return <span className='text-2xl'>{formatMoney(total)}</span>;
    } 

    const checkOut = () => {
        if(readyForCheckOut.length > 0){
            setVisible(false);
            navigate("/check_out");
        }else{
            return toast.warning("Select items from the cart", { position: toast.POSITION.TOP_RIGHT }); 
        }
    }

    return (
        <div>
            <Sidebar 
                visible={visible} 
                position="right" 
                onHide={() => {
                    setVisible(false);
                    cancelCheckOut();
                }} 
                style={{ width: "30rem" }}
            >
                <h2 className='flex gap-1 items-center text-black font-semibold text-xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Shipping Cart
                </h2>
                <div className='mt-8 grid gap-5 pb-20'>
                    {
                        cart?.cart?.length > 0 ?
                        cart?.cart?.map((cart, idx) => (
                            <div className='flex justify-between items-center' key={cart.productId}>
                                <div className='flex gap-5'>
                                    <div className='flex items-center'>
                                        <input 
                                            type="checkbox" 
                                            className='cursor-pointer h-5 w-5'
                                            value={cart.select}
                                            onChange={() => selectItemToCheckOut(idx)}
                                        />
                                    </div>
                                    <div className='h-24 md:h-28 aspect-square bg-gray-100 rounded-lg grid place-items-center border overflow-hidden'>
                                        <img src={`http://localhost:4000/uploads${cart.productImage}`} alt={cart.productName} className='object-fit aspect-square'/>
                                    </div>
                                    <div className='grid gap-1'>
                                        <p className='text-md font-semibold text-black truncate'>{cart.productName}</p>
                                        <span className="font-semibold text-black text-xl">{formatMoney(cart.totalPrice)}</span>
                                        <div className='flex items-center rounded-lg h-8'>
                                            <button className='p-3' onClick={() => quantityControlButton(idx, "add")}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                            <input 
                                                type="number" 
                                                className='max-w-[60px] text-center'
                                                value={cart.quantity}
                                                onChange={(e) => handleQuantityChange(e, idx)}
                                            />
                                            <button className='p-3' onClick={() => quantityControlButton(idx, "minus")}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex h-full items-baseline'>
                                    <button className='hover:text-blue-500 divide-purple-150 cursor-pointer' onClick={() => saveChanges(idx)} disabled={disableButton.save}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    <button className='hover:text-red-500 divide-purple-150' onClick={() => removeCartItem(idx)} disabled={disableButton.remove}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                        :
                        <div>
                            No items yet, start picking and add to your cart.  
                        </div>
                    }
                    <div className='text-xs bg-yellow-50 p-2 border border-yellow-500 text-yellow-600 rounded-lg'>Order quantities that exceeded the available quantity of the products may take a while to deliver due to production process.</div>
                </div>
                <div className='text-lg flex justify-end border border-b-0 border-x-0 border-gray-300 absolute bottom-0 left-0 right-0 py-5 px-2 bg-gray-100 font-semibold text-black text-md gap-2 items-center'>
                    <span>Total ({readyForCheckOut?.length} item) : </span>
                    <TotatCheckOut />
                    <button className='btn-dark px-5 py-2' onClick={checkOut}>Check Out</button>
                </div>
            </Sidebar>
        </div>
    )
}

export default SideCart;