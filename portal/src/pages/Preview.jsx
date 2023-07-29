import React, { useContext, useEffect, useState } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const Preview = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    const { cart, setCartAction, setBuyNowData, currentCustomer } = useContext(CustomerContext);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if(id){
            axios.get(`/erp/product/${id}`).then(({ data }) => {
                setProduct(data);
                setLoading(false);
            })
        }
    }, [id])

    const quantityControlButton = (action) => {
        switch(action){
            case "add": 
                return setQuantity(prev => Number(prev) + 1);
            case "minus": 
                return setQuantity(prev => Number(prev) - 1);
        }
    }

    const addToCart = async () => {
        const data = {
            select: false,
            productId: product._id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.productImg,
            totalPrice: product.price * quantity,
            quantity: quantity
        }

        if(quantity < 1){
            return toast.warning("Quantity must be 1 or more", { position: toast.POSITION.TOP_RIGHT });
        }

        const response = await axios.put("/erp/add_cart_item", { data: data, id: cart._id });
        if(response.statusText === "OK"){
            setCartAction("addToCart");
            setQuantity(1);
            return toast.success("Item add to cart successfully.", { position: toast.POSITION.TOP_RIGHT });
        }else{
            return toast.error("Failed to add item.", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    const buyNow = async () => {
        if(Number(quantity) < 1){
            return toast.warning("Quantity must be 1 or more", { position: toast.POSITION.TOP_RIGHT });
        }

        setBuyNowData({
            select: true,
            productId: product._id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.productImg,
            totalPrice: product.price * quantity,
            quantity: quantity
        })
        navigate("/check_out");
    }

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <div className='side-margin pt-32 pb-14'>
                {
                    loading ? 
                    <div className='grid place-items-center'>
                        <ProgressSpinner />
                    </div>
                    :
                    <div>
                        <div className='grid md:grid-cols-2 gap-10'>
                            <div className='grid place-items-center bg-gray-100 h-[300px] lg:h-[350px] rounded-lg overflow-hidden border'>
                                <img src={`http://localhost:4000/uploads${product.productImg}`} alt={product.name} className='object-fit aspect-square'/>
                            </div>
                            <div>
                                <div className='grid gap-4'>
                                    <h2 className='text-2xl font-bold'>{product.name}</h2>
                                    <p className='text-sm leading-4 text-gray-600'>{product.description}</p>
                                </div>
                                <div className='my-5 w-full h-[1px] bg-gray-200'/>
                                <div className='grid'>
                                    <span className='font-semibold text-xl'>₱{product.price}</span>
                                    <span className='text-gray-600 text-sm'>Unit Price</span>
                                </div>
                                <div className='my-5 w-full h-[1px] bg-gray-200'/>
                                <div className='flex gap-5 items-center'>
                                    <div className='flex items-center rounded-full'>
                                        <button className='p-3' onClick={() => quantityControlButton("add")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                        <input 
                                            type="number" 
                                            className='max-w-[80px] text-center' 
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                        <button className='p-3' onClick={() => quantityControlButton("minus")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className='text-sm text-gray-600'>
                                        <span className='text-yellow-600'>{product.quantity} </span> 
                                        Items Available
                                    </span>
                                </div>
                                <div className='text-yellow-600 text-xs pt-3'>{quantity > product.quantity && " Your desired quantity exceed the available quantity of the products. So, your order may take a while to deliver due to production process."}</div>
                                <div className='grid grid-cols-2 gap-5 mt-10'>
                                    <button className='btn-dark py-4' onClick={currentCustomer ? buyNow : () => navigate("/login")}>Buy Now</button>
                                    <button className='btn-dark-outlined' onClick={currentCustomer ? addToCart : () => navigate("/login")}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-16'>
                            <h3 className='text-xl font-semibold'>Product Information</h3>
                            <div className='mt-5 grid md:grid-cols-2 gap-4 md:gap-10'>
                                <div className='border rounded-lg p-4'>
                                    <span className='text-dark font-semibold text-md'>Cooking Instructions</span>
                                    <ul className='text-gray-600 text-sm mt-2 list-decimal px-4'>
                                        {
                                            product?.instructions?.map((instruct, idx) => (
                                                <li key={idx}>{instruct}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div className='border rounded-lg p-4'>
                                    <span className='text-dark font-semibold text-md'>Ingredients</span>
                                    <ul className='text-gray-600 text-sm mt-2'>
                                        {
                                            product?.rawMaterials?.map(raw => (
                                                <li key={raw.rawId}>{raw.name}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Preview;