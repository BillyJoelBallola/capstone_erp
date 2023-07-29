import { RawMaterial } from "../Models/RawMaterialModel.js";

export const addRawMaterial = async (req, res) => {
    const { supplier, name, measurement, quantity, price, storage } = await req.body;
    try {
        const newRawMaterial = await RawMaterial.create({
            supplier,
            name,
            measurement,
            quantity,
            price,
            storage
        })
        res.status(200).json(newRawMaterial);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateRawMaterial = async (req, res) => {
    const { _id, supplier, name, measurement, quantity, price, storage } = await req.body;
    const rawMaterialData = await RawMaterial.findById(_id);
    try {
        rawMaterialData.set({
            supplier,
            name,
            measurement,
            quantity,
            price,
            storage
        })
        rawMaterialData.save();
        res.status(200).json(rawMaterialData);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllRawMaterials = async (req, res) => {
    try {
        const response = await RawMaterial.find({}).populate("supplier").populate("storage");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getRawMaterial = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await RawMaterial.findById(id).populate("supplier");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteRawMaterial = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await RawMaterial.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const adjustRawMaterial = async (req, res) => {
    const { item, quantity } = await req.body;
    const rawMaterialData = await RawMaterial.findById(item._id);
    try {
        rawMaterialData.set({
            quantity: quantity,
        })
        rawMaterialData.save();
        res.status(200).json(rawMaterialData);
    } catch (error) {
        res.json(error.message);
    }
}