import { Department } from "../Models/DepartmentModel.js";

export const addDepartment = async (req, res) => {
    const { name } = await req.body;
    try {
        const newPosition = await Department.create({ name });
        res.status(200).json(newPosition); 
     } catch (error) {
         res.status(500).json(error.message);
     }
}

export const getAllDepartments = async (req, res) => {
    try {
       res.status(200).json(await Department.find({})); 
    } catch (error) {
        res.status(500).json(error.message);
    }
} 