import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [update, setUpdate] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(currentUser === null){
            axios.get("/erp/profile").then(({ data }) => {
                setCurrentUser(data);
                setUpdate("");
            }) 
        }
    }, [update]);

    return(
        <UserContext.Provider value={{ currentUser, setCurrentUser, setUpdate, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    )
}