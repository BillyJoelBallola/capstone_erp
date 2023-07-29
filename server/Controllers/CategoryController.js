import { Category } from "../Models/CategoryModel.js";

export const addCategory = async (req, res) => {
    const { name } = await req.body;    
    try {
        const response = await Category.create({ name: name });
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const response = await Category.find({});
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}