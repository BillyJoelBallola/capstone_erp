import { Adjustment } from "../Models/AdjustmentModel.js";

export const addAdjustment = async (req, res) => {
    const { item, remarks, quantity, user } = await req.body;
    try {
        const newAdjustment = await Adjustment.create({
            user,
            item,
            oldQuantity: item.quantity,
            newQuantity: quantity,
            remarks
        })
        res.status(200).json(newAdjustment)
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllAdjustments = async (req, res) => {
    try {
        const response = await Adjustment.find({});
        res.status(200).json(response)
    } catch (error) {
        res.json(error.message);
    }
}
