import { Employee } from "../Models/EmployeeModel.js";

export const addEmployee = async (req, res) => {
    const { name, dob, age, gender, address, contact, department, salary, deductions, emergency, type } = await req.body;
    try {
        const newEmployee = await Employee.create({
            name,
            dob,
            age,
            gender,
            address,
            contact,
            department,
            salary,
            deductions,
            emergency,
            status: true,
            type
        })
        res.status(200).json(newEmployee);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateEmployee = async (req, res) => {
    const { _id, name, dob, age, gender, address, contact, department, salary, deductions, emergency, status, type } = await req.body;
    try {
        const employeeData = await Employee.findById(_id);
        employeeData.set({
            name,
            dob,
            age,
            gender,
            address,
            contact,
            department,
            salary,
            deductions,
            emergency,
            status,
            type
        })
        employeeData.save();
        res.status(200).json(employeeData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateManyEmployee = async (req, res) => {
    const { selectedRows, status } = await req.body;
    const ids = [];
    selectedRows?.map((item) => {
        if(!ids.includes(item._id)){
            ids.push(item._id);
        }
    })
    try {
        const response = await Employee.updateMany({ _id: { $in: ids }}, {$set: { status: status }})
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllEmployees = async (req, res) => {
    try {
        const response = await Employee.find({}).populate("department");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getEmployeeById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Employee.findById(id).populate("department");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}