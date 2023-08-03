import { Bill } from "../Models/BillModel.js";

export const addBill = async (req, res) => {
    const { reference, purchase, supplier, date, dueDate, journal, purchaseOrder, total } = await req.body;
    try {
        const newBill = await Bill.create({
            reference,
            purchase,
            supplier,
            date,
            dueDate,
            journal,
            purchaseOrder,
            total,
            state: 1,
            payment: 1
        });
        res.status(200).json(newBill);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateBill = async (req, res) => {
    const { id, date, dueDate, journal } = await req.body;
    try {
        const billData = await Bill.findById(id);
        billData.set({
            date,
            dueDate,
            journal,
        });
        billData.save();
        res.status(200).json(billData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const changeState = async (req, res) => {
    const { state, id } = await req.body;
    const billData = await Bill.findById(id);
    try {
        billData.set({ state: state });
        billData.save();
        res.status(200).json(billData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const changePayment = async (req, res) => {
    const { payment, id } = await req.body;
    const billData = await Bill.findById(id);
    try {
        billData.set({ payment: payment });
        billData.save();
        res.status(200).json(billData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getAllBill = async (req, res) => {
    try {
        const response = await Bill.find({}).populate("supplier").populate("purchase");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getPurchasedBill = async (req, res) => {
    const { id } = await req.params;
    try {
        const allBill = await Bill.find({});
        const response = allBill.filter(bill => bill.purchase.toString() === id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getBillById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Bill.findById(id).populate("purchase");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}