import { Deduction } from "../Models/DeductionModel.js";

export const addDeduction = async (req, res) => {
    const { name, amount } = await req.body;
    try {
        const newDeduction = await Deduction.create({
            name, 
            amount
        });
        res.status(200).json(newDeduction);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getAllDeductions = async (req, res) => {
    try {
        const response = await Deduction.find({});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}