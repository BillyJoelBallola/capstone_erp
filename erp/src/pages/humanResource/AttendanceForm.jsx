import React, { useEffect, useState } from 'react';
import DialogBox from '../../components/DialogBox';
import { toast } from "react-toastify";
import { useFormik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import axios from 'axios';

const AttendanceForm = ({ visible, setVisible, setAction, attendanceData }) => {
    const [employees, setEmployees] = useState([]);
    const [disabled, setDisabled] = useState(false);
    
    useEffect(() => {
        axios.get("/erp/employees").then(({ data }) => {
            setEmployees(data);
        })  
    }, [])
    
    const formik = useFormik({
        initialValues: {
            employee: ""
        },
        validationSchema: Yup.object({
            employee: Yup.string()
                .required("Employee is required")
        }),
        onSubmit: async (values, helpers) => {
            setDisabled(true);
            const [date, time] = moment(Date.now()).format().split("T");
            let outAlready = false;
            let present = false;
    
            attendanceData.map(async (attendance) => {
                if(attendance.employee._id.toString() === values.employee && attendance.timeIn.includes(date) && attendance.timeOut === null){
                    present = true;
                }

                if(attendance.employee._id.toString() === values.employee && attendance.timeIn.includes(date) && attendance.timeOut !== null){
                    outAlready = true;
                }
            })

            if(present){
                helpers.resetForm();
                setVisible(false);
                return toast.warning("Employee already timed-in.", { position: toast.POSITION.TOP_RIGHT });
            }

            if(values.employee && !!outAlready === false){ 
                try {
                    await axios.post("/erp/timeIn_attendance", { id: values.employee });
                    setAction("timeIn");
                    setVisible(false);
                    setDisabled(false);
                    return toast.success("Time in.", { position: toast.POSITION.TOP_RIGHT });
                } catch (error) {
                    setVisible(false);
                    setDisabled(false);
                    return toast.error("Failed to add time-in.", { position: toast.POSITION.TOP_RIGHT });
                }
            }

            if(values.employee && outAlready){
                helpers.resetForm();
                setVisible(false);
                return toast.warning("Employee is already out.", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    })

    return (
        <DialogBox
            header={"Attendance - Time In"}
            visible = {visible}
            setVisible = {setVisible}
            w={"50vw"}
        >
            <form className="grid gap-4" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="" className={`${ formik.touched.employee && formik.errors.employee ? "text-red-400" : "" }`}>
                        {formik.touched.employee && formik.errors.employee ? formik.errors.employee : "Employee"}
                    </label>
                    <select
                        name="employee"
                        value={formik.values.employee}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">-- select employee --</option>
                        {
                            employees?.map(employee => (
                                <option value={employee._id} key={employee._id}>{employee.name}</option>
                            ))
                        }
                    </select>
                </div>
                <button className="btn-dark" type="submit" disabled={disabled}>Time-in</button>
            </form>
        </DialogBox>
    )
}

export default AttendanceForm