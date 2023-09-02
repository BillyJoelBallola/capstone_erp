import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const CustomerContext = createContext({});

export const CustomerContextProvider = ({ children }) => {
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [buyNowData, setBuyNowData] = useState({});
    const [cart, setCart] = useState(null);
    const [update, setUpdate] = useState("");
    const [cartAction, setCartAction] = useState("");
    const [token, setToken] = useState(null);

    useEffect(() => {
        window.cookieStore.get('portal_token')
            .then((token) => {
                const { value } = token; 
                setToken(value);
            })
            .catch((err) => {
                setToken(null);
            })
    }, []);

    useEffect(() => {
        if(currentCustomer === null || token){
            axios.get("/erp/customer_profile").then(({ data }) => {
                setCurrentCustomer(data);
                setUpdate("");
            }) 
        }
    }, [update, token]);

    useEffect(() => {
        if(currentCustomer !== null || cartAction !== ""){
            axios.get(`/erp/customer_cart/${currentCustomer?._id}`).then(({ data }) => {
                setCart(data);
                setCartAction("");
            })
        }
    }, [cartAction, currentCustomer]);
    
    return(
        <CustomerContext.Provider 
            value={{ 
                currentCustomer, 
                setCurrentCustomer, 
                setUpdate, 
                token, 
                setToken, 
                cart, 
                setCart, 
                setCartAction, 
                buyNowData, 
                setBuyNowData 
            }}
        >
            {children}
        </CustomerContext.Provider>
    )
}