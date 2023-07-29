import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [update, setUpdate] = useState("");

    useEffect(() => {
        if(currentUser === null){
            axios.get("/erp/profile").then(({ data }) => {
                setCurrentUser(data);
                setUpdate("");
            }) 
        }
    }, [update]);

    return(
        <UserContext.Provider value={{ currentUser, setCurrentUser, setUpdate }}>
            {children}
        </UserContext.Provider>
    )
}