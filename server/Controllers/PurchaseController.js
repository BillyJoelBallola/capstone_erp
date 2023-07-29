import { Purchase } from "../Models/PurchaseModel.js";
import { RawMaterial } from "../Models/RawMaterialModel.js";

export const addPurchase = async (req, res) => {
    const { supplier, date, expectedArrival, materials, total, automate, reference } = await req.body;
    try {
        const newPurchase = await Purchase.create({
            reference,
            supplier,
            date,
            expectedArrival,
            materials,
            total,
            state: 1,
            automate
        });
        res.status(200).json(newPurchase);
    } catch (error) {
        res.json(error.message);
    }
}

export const updatePurchase = async (req, res) => {
    const { _id, supplier, date, expectedArrival, materials,total, state, automate } = await req.body;
    const purchaseData = await Purchase.findById(_id);
    try {
        purchaseData.set({
            supplier,
            date,
            expectedArrival,
            materials,
            total,
            state,
            automate
        });
        purchaseData.save();
        res.status(200).json(purchaseData);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllPurchase = async (req, res) => {
    try {
        const response = await Purchase.find({}).populate("supplier");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getPurchase = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Purchase.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const replenishMaterial = async (req, res) => {
    const { material, reference } = await req.body;
    try {
        const newPurchase = await Purchase.create({
            reference, 
            supplier: typeof material.supplier === "object" ? material.supplier._id : material.supplier,
            date: Date.now(),
            expectedArrival:  Date.now(),
            materials: [
                {
                    id: material._id,
                    name: material.name,
                    qty: 10,
                    uom: material.measurement,
                    price: material.price
                }
            ],
            total: material.price,
            state: 1
        });
        res.status(200).json(newPurchase);
    } catch (error) {
        res.json(error.message);
    } 
}

export const changeState = async (req, res) => {
    const { state, id } = await req.body;
    const purchaseData = await Purchase.findById(id);
    
    if(state === 3){
        purchaseData.materials.map(async (raw) => {
            const rawMaterialsData = await RawMaterial.findById(raw.id);
            const totalQty = rawMaterialsData.quantity + Number(raw.qty);
            if(rawMaterialsData._id.toString() === raw.id){
                rawMaterialsData.set({ quantity: totalQty });
                rawMaterialsData.save();
            }
        })
    }

    try {
        purchaseData.set({ state });
        purchaseData.save();
        res.status(200).json(purchaseData);
    } catch (error) {
        res.json(error.message);
    }
}