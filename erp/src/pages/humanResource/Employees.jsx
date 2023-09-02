import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import CustomTable from '../../components/CustomTable';
import axios from "axios";

const Employees = () => {
    const [employees, setEmployess] = useState([]);
    const [action, setAction] = useState([]);
    const { setLoading } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/employees").then(({ data }) => {
            setEmployess(data.reverse());
            setLoading(false);
            setAction("");
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "name", filter: "name", header: "Name" },
        { field: "department.name", filter: "department.name", header: "Department" },
        { field: "contact.phoneNumber", filter: "contact.phoneNumber", header: "Contact" },
        { body: "addressFormat", header: "Address" },
        { body: "isActive", header: "Status" },
    ];

    return (
        <CustomTable name={"Employee"} columns={columns} dataValue={employees} setAction={setAction} metaKey={false}/>
    )
}

export default Employees;   