import { Purchase } from "../Models/PurchaseModel.js";
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
        res.status(500).json(error.message);
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
        res.status(500).json(error.message);
    }
}

export const getAllSuppliers = async (req, res) => {
    try {
        const response = await Supplier.find({});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getSupplierById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Supplier.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const supplierOnTimeRate = async (req, res) => {
    try {
        const supplierResponse = await Supplier.find({});
        const purchaseResponse = await Purchase.find({});

        const supplierOnTimeData = supplierResponse.map(supplier => {
            const purchases = purchaseResponse.filter(purchase => purchase.supplier.toString() === supplier._id.toString());
            const onTimeOrders = purchases.filter(purchase => new Date(purchase.date) <= new Date(purchase.expectedArrival));
            
            const rate = purchases.length > 0 ? (onTimeOrders.length / purchases.length) * 100 : 0;

            return {
                supplier: supplier.business,
                supplierId: supplier._id,
                rate: rate
            }
        })  

        res.status(200).json(supplierOnTimeData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}