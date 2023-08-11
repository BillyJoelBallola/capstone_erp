import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import CustomTable from '../../components/CustomTable';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const Attendance = () => {
    const { setLoading } = useContext(UserContext);
    const [attendance, setAttendance] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/current_attendance").then(({ data }) => {
            setAttendance(data);
            setLoading(false);
        })
    }, [action])

    const columns = [
        { selectionMode: true, }, 
        { field: "employee.name", filter: "employee.name", header: "Employee" }, 
        { body: "timeInFormat", filter: "timeIn", header: "Time-in" }, 
        { body: "timeOutFormat", filter: "timeOut", header: "Time-out" }, 
    ]

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <CustomTable name={"Attendance"} columns={columns} dataValue={attendance} setAction={setAction} metaKey={true}/>
        </>
    )
}

export default Attendance;