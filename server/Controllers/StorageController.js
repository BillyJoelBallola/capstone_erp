import { Storage } from "../Models/StorageModel.js";

export const addStorage = async (req, res) => {
    const { name } = await req.body;    
    try {
        const response = await Storage.create({ name: name });
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllStorage = async (req, res) => {
    try {
        const response = await Storage.find({});
        res.json(response);
    } catch (error) {
        res.json(error.message);
    }
}