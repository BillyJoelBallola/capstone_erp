import { Position } from "../Models/PositionModel.js";

export const addPosition = async (req, res) => {
    const { name } = await req.body;
    try {
        const newPosition = await Position.create({ name });
        res.status(200).json(newPosition); 
     } catch (error) {
         res.status(500).json(error.message);
     }
}

export const getAllPositions = async (req, res) => {
    try {
       res.status(200).json(await Position.find({})); 
    } catch (error) {
        res.status(500).json(error.message);
    }
} 