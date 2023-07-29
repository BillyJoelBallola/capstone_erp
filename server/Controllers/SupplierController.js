import { Supplier } from "../Models/SupplierModel.js";

export const addSupplier = async (req, res) => {
    const { name, business, address, contact } = await req.body;
    try {
        const newSupplier = await Supplier.create({
            name,
            business,
            address,
            contact,
        });
        res.status(200).json(newSupplier);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateSupplier = async (req, res) => {
    const { id, name, business, address, contact } = await req.body;
    const supplierData = await Supplier.findById(id);
    try {
        supplierData.set({
            name,
            business,
            address,
            contact,
        });
        supplierData.save();
        res.status(200).json(supplierData);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllSuppliers = async (req, res) => {
    try {
        const response = await Supplier.find({});
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getSupplierById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Supplier.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}