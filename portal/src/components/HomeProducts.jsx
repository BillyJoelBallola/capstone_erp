import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CustomerContext } from '../context/CustomerContext';
import { ToastContainer, toast } from "react-toastify";
import { NavLink, useNavigate } from 'react-router-dom';
import { formatMoney } from '../static/_functions';
import axios from "axios";

const HomeProducts = ({ query, display }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [addToCartButton, setAddToCartButton] = useState(false);
    const { setCartAction, cart, currentCustomer } = useContext(CustomerContext);

    useEffect(() => {
        axios.get("/erp/products").then(({ data }) => {
            setProducts(data.filter(item => item.status === true));
            setLoading(false);
        })
    }, [])

    const filteredProductsByNames = useMemo(() => {
        return products.filter(product => {
            return product.name.toLowerCase().includes(query.toLowerCase())
        })
    }, [products, query])

    const addToCart = async (id) => {
        if(currentCustomer){
            setAddToCartButton(true);
            const productInfo = products.find(item => item._id === id);
            const data = {
                select: false,
                productId: productInfo._id,
                productName: productInfo.name,
                productPrice: productInfo.price,
                productImage: productInfo.productImg,
                totalPrice: productInfo.price * 1,
                quantity: 1
            }
    
            const response = await axios.put("/erp/add_cart_item", { data: data, id: cart?._id });
            if(response.statusText === "OK"){
                setCartAction("addToCart");
                setAddToCartButton(false);
                return toast.success("Item add to cart successfully.", { position: toast.POSITION.BOTTOM_RIGHT });
            }else{
                return toast.error("Failed to add item.", { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }else{
            navigate("/login");
        }
    }

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <div className='side-margin'>
                <h2 className='font-semibold text-xl'>Our Products <i>{query ? `/ ${query}` : "" }</i></h2>
                {
                    loading ? 
                    <div className='grid place-items-center pt-20'>
                        <ProgressSpinner /> 
                    </div>
                    : 
                    display === 'grid' ?
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 mt-6'>
                        {
                            filteredProductsByNames ?
                            filteredProductsByNames?.map(product => (
                                <div className='grid gap-2' key={product._id}>
                                    <div className='bg-gray-100 md:h-42 lg:h-48 rounded-lg grid place-items-center overflow-hidden border'>
                                        <img src={`http://localhost:4000/uploads${product.productImg}`} alt={product.name} className='object-fit aspect-square'/>
                                    </div>
                                    <div className='grid lg:gap-2 px-1'>
                                        <div className='flex gap-1 overflow-hidden items-center justify-between font-semibold text-lg'>
                                            <NavLink to={`/preview/${product._id}`} className='truncate hover:text-blue-400 duration-150'>{product.name}</NavLink>
                                            <span>
                                                {formatMoney(product.price)}
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-500 truncate'>{product.description}</p>
                                        <button className='btn-dark-outlined max-w-min whitespace-nowrap mt-3' onClick={() => addToCart(product._id)} disabled={addToCartButton}>Add to Cart</button>
                                    </div>
                                </div>  
                            ))
                            :
                            <div>
                                No Item Found.
                            </div>
                        }
                    </div>
                    : 
                    // list 
                    <div className='grid gap-3 mt-6'>
                        {
                            filteredProductsByNames ?
                            filteredProductsByNames?.map(product => (
                                <div className='flex flex-col md:flex-row gap-2 justify-between bg-gray-100 border rounded-lg p-4' key={product._id}>
                                    <div className='flex gap-6'>
                                        <div className='bg-gray-100 min-w-32 w-32 md:w-40 rounded-lg grid place-items-center overflow-hidden border'>
                                            <img src={`http://localhost:4000/uploads${product.productImg}`} alt={product.name} className='object-fit aspect-square'/>
                                        </div>
                                        <div className='flex flex-col justify-between'>
                                            <div className='grid gap-1 overflow-hidden items-center justify-between font-semibold text-lg'>
                                                <NavLink to={`/preview/${product._id}`} className='truncate hover:text-blue-400 duration-150'>{product.name}</NavLink>
                                                <p className='text-sm text-gray-500 truncate'>{product.description}</p>
                                            </div>
                                            <span className='text-lg font-semibold'>{formatMoney(product.price)}</span>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <button className='self-baseline btn-dark-outlined max-w-min whitespace-nowrap mt-3' onClick={() => addToCart(product._id)} disabled={addToCartButton}>Add to Cart</button>
                                    </div>
                                </div>  
                            ))
                            :
                            <div>
                                No Item Found.
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default HomeProducts;