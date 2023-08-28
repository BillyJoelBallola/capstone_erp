import { Order } from "../Models/OrderModel.js";
import { Product } from "../Models/ProductModel.js";
import { Production } from "../Models/ProductionModel.js";
import { RawMaterial } from "../Models/RawMaterialModel.js";
import { Shipment } from "../Models/ShipmentModel.js";

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

export const productionPlanning = async (req, res) => {
    try {
        const productsResponse = await Product.find({});
        const productionResponse = await Production.find({});
        const shipmentResponse = await Shipment.find({}).populate("order"); 
        const ordersResponse = await Order.find({});

        const pendingOrders = ordersResponse.filter(order => order.state === 2);
        const confirmProduction = productionResponse.filter(prod => prod.state === 2);
        const shipping = shipmentResponse.filter(ship => ship.state >= 2 && (ship.order.state === 2 || ship.order.state === 3));

        const planningProducts = productsResponse.map(product => {
            let totalDemand = 0;
            let inComing = 0;
            let outGoing = 0;
            let inComingArray = [];
            let outGoingArray = [];

            pendingOrders.map(pendings => {
                pendings.orders.map(order => {
                    if (product._id.toString() === order.productId) {
                        totalDemand += order.quantity;
                    }
                });
            });

            confirmProduction.map(production => {
                if (product._id.toString() === production.product.toString()) {
                    inComing += production.quantity;
                    inComingArray.push(production);
                }
            });

            shipping.map(ship => {
                ship.order.orders.map(order => {
                    if(order.productId === product._id.toString()){
                        outGoing += order.quantity;
                        outGoingArray.push(ship);
                    }
                })
            })

            return {
                ...product.toObject(),
                totalDemand: totalDemand,
                forecastInDepth: [...inComingArray, ...outGoingArray],
                forecast: {
                    inComing: inComing,
                    outGoing: outGoing
                }
            };
        });

        res.status(200).json(planningProducts);
    } catch (error) {
        res.status(500).json(error.message);
    }
}