import { Product } from "../Models/ProductModel.js";
import { Production } from "../Models/ProductionModel.js";
import { RawMaterial } from "../Models/RawMaterialModel.js";

export const addProduction = async (req, res) => {
    const { product, quantity, date, automate, reference } = await req.body;
    try {
        const newProduction = await Production.create({
            reference,
            product,
            quantity,
            date,
            state: 1,
            automate
        });
        res.status(200).json(newProduction);
    } catch (error) {
        res.json(error.message);
    }
} 
2
export const updateProduction = async (req, res) => {
    const { _id, product, quantity, date, state, automate } = await req.body;
    const productionInfo = await Production.findById(_id);
    try {
        productionInfo.set({
            product,
            quantity,
            date,
            state,
            automate
        });
        productionInfo.save();
        res.status(200).json(productionInfo);   
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllProduction = async (req, res) => {
    try {
        const response = await Production.find({}).populate("product");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getProduction = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Production.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const addReplenishment = async (req, res) => {
    const { productId, reference } = await req.body;
    try {
        const productionInfo = await Production.create({
            product: productId,
            reference: reference,
            quantity: 10,
            date: Date.now(),
            state: 1
        })
        res.status(200).json(productionInfo);
    } catch (error) {
        res.json(error.message);
    }
}

export const changeState = async (req, res) => {
    const { state, id } = await req.body;
    const productionData = await Production.findById(id);
    const productData = await Product.findById(productionData.product);

    if(state === 2){
        productData.rawMaterials.map(async (raw) => {
            const rawMatsData = await RawMaterial.findById(raw.rawId);
            const computedQty = Number(raw.qty) * productionData.quantity;
            const totalQty = rawMatsData.quantity - computedQty;
            if(rawMatsData._id.toString() === raw.rawId){
                rawMatsData.set({ quantity: totalQty });
                rawMatsData.save();
            }
        })
    }

    if(state === 3){
        const totalQty = productData.quantity + productionData.quantity;
        productData.set({ quantity: totalQty });
        productData.save();
    }

    if(state === 4 && productionData.state === 2){
        productData.rawMaterials.map(async (raw) => {
            const rawMatsData = await RawMaterial.findById(raw.rawId);
            const oltQty = Number(raw.qty) * productionData.quantity;
            const totalQty = rawMatsData.quantity + oltQty;
            if(rawMatsData._id.toString() === raw.rawId){
                rawMatsData.set({ quantity: totalQty });
                rawMatsData.save();
            }
        })
    }

    try {
        productionData.set({ state });
        productionData.save();
        res.status(200).json(productionData);
    } catch (error) {
        res.json(error.message);
    }
}