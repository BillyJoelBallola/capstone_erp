import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../context/UserContext";
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [action, setAction] = useState("");
    const { currentUser, setLoading } = useContext(UserContext);;

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/users").then(({data}) => {
            const users = data.filter(user => ( user._id !== currentUser?._id ))
            setUsers(users.reverse());
            setAction("");
            setLoading(false);
        })
    }, [action, currentUser])

    const columns = [
        { selectionMode: true, }, 
        { field: "name", filter: "name", header: "Name" }, 
        { field: "email", filter: "email", header: "Email" }, 
        { field: "role", filter: "role", header: "Role"  }, 
        { body: "isActive", header: "Status" }, 
    ]

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable dataValue={users} name="User" columns={columns} setAction={setAction} metaKey={false}/>
        </>
  )
}

export default ManageUsers