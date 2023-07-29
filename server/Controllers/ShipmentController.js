import { Shipment } from "../Models/ShipmentModel.js";

export const addShipment = async (req, res) => {
    const { orderId, reference} = await req.body;
    try {
        const newShipment = await Shipment.create({
            order: orderId,
            reference: reference,
            state: 1
        })
        res.status(200).json(newShipment);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateShipment = async (req, res) => {
    const { id, expectedArrival, scheduledDate} = await req.body;
    const shipmentData = await Shipment.findById(id);
    try {
        shipmentData.set({
            expectedArrival,
            scheduledDate
        })
        shipmentData.save();
        res.status(200).json(shipmentData);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllShipments = async (req, res) => {
    try {
        const response =  await Shipment.find({}).populate("order");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getShipementById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Shipment.findById(id).populate("order");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const changeStaste = async (req, res) => {
    const { id, state } = await req.body;
    const shipmentData = await Shipment.findById(id);
    try {
        shipmentData.set({
            state
        })
        shipmentData.save();
        res.status(200).json(shipmentData);
    } catch (error) {
        res.json(error.message);
    }
}