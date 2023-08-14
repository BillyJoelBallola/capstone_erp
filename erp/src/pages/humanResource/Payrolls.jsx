import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import CustomTable from '../../components/CustomTable';
import axios from 'axios';

const Payrolls = () => {
    const { setLoading } = useContext(UserContext);
    const [payrolls, setPayrolls] = useState([]);
    const [action, setAction] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get("/erp/payslips").then(({ data }) => {
            setPayrolls(data.reverse());
            setAction("");
            setLoading(false);
        })
    }, [action])

    const columns = [
        { selectionMode: true },
        { body: "dateFormat", header: "Date" }, 
        { field: "employee.name", filter: "employee.name", header: "Employee" }, 
        { field: "gross", filter: "gross", header: "Gross" }, 
        { field: "deduction", filter: "deduction", header: "Deductions" }, 
        { field: "netPay", filter: "netPay", header: "Netpay" }, 
        { body: "paymentStatus", header: "Status" } 
    ]

    return (
        <CustomTable dataValue={payrolls} columns={columns} name={"Payroll"} setAction={setAction} metaKey={true} />
    )
}

export default Payrolls;