import React, { useContext, useEffect, useState } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { useNavigate } from "react-router-dom";
import DialogBox from '../components/DialogBox';
import { Dialog } from 'primereact/dialog';
import successIcon from "../assets/success_icon.png";
import moment from "moment";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const PurchaseMessage = ({ purchase }) => {
    const navigate = useNavigate();

    return (
        <Dialog 
            header={"Purchase"} 
            visible={purchase} 
            style={{ width: '25vw' }} 
            onHide={() => navigate("/account/purchase")}
        >   
            <div className='grid place-items-center'>
                <img src={successIcon} alt="icon" />
            </div>
            <p className='text-center mt-4 text-sm'>
                Your purchase order has been successfully saved. You can track your order in account page and my purchase tab. Thank you!
            </p>
        </Dialog>
    )
}

const CheckOut = () => {
    const navigate = useNavigate();
    const [disableButton, setDisableButton] = useState(false);
    const { cart, setCart, buyNowData, currentCustomer, setBuyNowData, setCartAction } = useContext(CustomerContext);
    const [checkOutItems, setCheckOutItems] = useState([]);
    const [overAllTotal, setOverAllTotal] = useState(0);
    const [dialogVisble, setDialogVisble] = useState(false);
    const [purchase, setPurchase] = useState(false);

    const referenceGenerator = (func) => {
        const [m, d, y] = moment(Date.now()).format("L").split("/");
        return  `${func}-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}-${y}`;
    }

    useEffect(() => {
        const newCart = cart?.cart?.filter(item => (item.select === true));
        if(newCart?.length === 0 && Object.keys(buyNowData).length === 0){
            navigate("/");
        }
        setCheckOutItems(newCart);
    }, [cart])   

    useEffect(() => {
        if (checkOutItems) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }, [checkOutItems])

    const Address = () => {
        return (
            <div className='mt-2 text-sm'>
                <span>{currentCustomer?.address?.street}, {currentCustomer?.address?.barangay}, {currentCustomer?.address?.municipal}, {currentCustomer?.address?.province}, {currentCustomer?.address?.country}</span>
            </div>
        )
    }

    useEffect(() => {
        const totalPrice = () => {
            let total = 0;
            
            if(Object.keys(buyNowData).length !== 0){
                total = buyNowData.totalPrice;
            }else{
                checkOutItems?.map(item => {
                    total += item.totalPrice;
                })
            }
            setOverAllTotal(total); 
        }
        totalPrice();
    }, [checkOutItems, buyNowData])

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

    useEffect(() => {
        setTimeout(() => {
            if(purchase){
                setPurchase(false);
                navigate("/account/purchase");
                const newCart = cart?.cart?.filter(item => item.select !== true);
                axios.put("/erp/change_cart_item", { id: cart?._id, cart: newCart });
                setCartAction("purchase");
            }
        }, 4000)
    }, [purchase])

    const handlePurchase = async () => {
        setDisableButton(true);
        const orders = Object.keys(buyNowData).length !== 0 ? buyNowData : checkOutItems;
        const data = { customer: currentCustomer?._id, orders: orders, reference: referenceGenerator("ORD"), total: overAllTotal, date: Date.now() };
        const response = await axios.post("/erp/add_order", data);
        if(response.statusText === "OK"){
            setDisableButton(false);
            setPurchase(true);
        }else{
            return toast.error("Failed to purchase.", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <DialogBox
                visible={dialogVisble}
                setVisible={setDialogVisble}
                func={buttonFuction}
            />
            { 
                purchase && 
                <PurchaseMessage 
                    purchase={purchase} 
                    setPurchase={setPurchase}
                /> 
            }
            <div className='side-margin pt-32 pb-14'>
                <div className='grid lg:grid-cols-[1fr_300px] gap-5'>
                    <div className='border rounded-lg p-6'>
                        <h2 className='text-xl font-bold'>Review Items</h2>
                        <div className='flex flex-col gap-4 mt-4'>
                            {   
                                checkOutItems &&
                                checkOutItems.map(item => (
                                    <div key={item.productId} className='flex gap-5 items-center'>
                                        <div className='w-20 md:w-32 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                            <img src={`http://localhost:4000/uploads${item.productImage}`} alt={item.productName} className='object-fit aspect-square'/>
                                        </div>
                                        <div className='w-full'>
                                            <div className='flex items-center justify-between md:text-xl font-semibold'>
                                                <h3>{item.productName}</h3>
                                                <p>₱{item.totalPrice}</p>
                                            </div>
                                            <p className='self-end'>Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))
                            }
                            {   
                                Object.keys(buyNowData).length !== 0 &&
                                <div key={buyNowData.productId} className='flex gap-5 items-center'>
                                     <div className='w-20 md:w-32 aspect-square bg-gray-100 rounded-lg grid place-items-center overflow-hidden border'>
                                            <img src={`http://localhost:4000/uploads${buyNowData.productImage}`} alt={buyNowData.productName} className='object-fit aspect-square'/>
                                        </div>
                                    <div className='w-full'>
                                        <div className='flex items-center justify-between md:text-xl font-semibold'>
                                            <h3>{buyNowData.productName}</h3>
                                            <p>₱{buyNowData.totalPrice}</p>
                                        </div>
                                        <p className='self-end'>Quantity: {buyNowData.quantity}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='border rounded-lg p-6'>
                        <h2 className='text-xl font-bold'>Order Summary</h2>
                        <div className='grid gap-5 mt-4'>
                            <div>
                                <h3 className='font-semibold'>Delivery Information</h3>
                                <Address />
                            </div>
                            <div>
                                <h3 className='font-semibold'>Payment Details</h3>
                                <div className='mt-2 text-sm'>empty</div>
                            </div>
                            <div className='grid gap-2'>
                                <div className='h-[1px] bg-gray-300'/>      
                                <div className='flex justify-between font-semibold'>
                                    <span>Total</span>
                                    <span>₱{overAllTotal}</span>
                                </div>
                            </div>
                            <div className='grid gap-2'>
                                <button className='btn-primary py-2' onClick={handlePurchase} disabled={disableButton}>Purchase</button>
                                <button className='btn-gray' onClick={() => setDialogVisble(true)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckOut;