import { Order } from "../Models/OrderModel.js";
import jwt from 'jsonwebtoken';

export const addOrder = async (req, res) => {
    const { customer, orders, total, reference, expectedArrival } = await req.body;
    try {
        const newOrder = await Order.create({
            reference,
            customer,
            orders,
            total,
            state: 1,
            invoice: 1,
            expectedArrival,
            date: Date.now()
        })
        res.status(200).json(newOrder);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateOrder = async (req, res) => {
    const { salesPerson, orderId } = await req.body;
    try {
        const orderData = await Order.findById(orderId); 
        orderData.set({ salesPerson });
        orderData.save();
        res.status(200).json(orderData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getOrdersByCustomerId = async (req, res) => {
    const { portal_token } = await req.cookies;
    if(portal_token){
        jwt.verify(portal_token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const orders = await Order.find({ customer: data.id });
            res.status(200).json(orders);
        })
    }else{   
        res.json(null);
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const response = await Order.find({}).populate("customer");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getOrderById = async (req, res) => {
    const { id } = await req.params;
    try {
        const orderData = await Order.findById(id).populate("customer");
        res.status(200).json(orderData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const changeState = async (req, res) => {
    const { id, state, invoice } = await req.body;
    try {
        const orderData = await Order.findById(id);
        orderData.set({ 
            state,
            invoice
        });
        orderData.save();
        res.status(200).json(orderData);
    } catch (error) {
        res.status(500).json(error.message);
    } 
} 
