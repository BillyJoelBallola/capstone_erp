import { Invoice } from "../Models/InvoiceModel.js";

export const addInvoice = async (req, res) => {
    const { reference, order, customer, date, dueDate, journal, productOrder, total } = await req.body;
    try {
        const newInvoice = await Invoice.create({
            reference,
            order,
            customer,
            date,
            dueDate,
            journal,
            productOrder,
            total,
            state: 1,
            payment: 1
        })
        res.status(200).json(newInvoice);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateInvoice = async (req, res) => {
    const { id, date, dueDate, journal } = await req.body;
    try {
        const invoiceData = await Invoice.findById(id);
        invoiceData.set({
            date,
            dueDate,
            journal
        })
        invoiceData.save();
        res.status(200).json(invoiceData);
    } catch (error) {   
        res.status(500).json(error.message);
    }
}

export const getAllInvoice = async (req, res) => {
    try {
        const response = await Invoice.find({}).populate("order").populate("customer");
        res.status(200).json(response);
    } catch (error) {   
        res.status(500).json(error.message);
    }
}

export const getInvoiceById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Invoice.findById(id).populate("order").populate("customer");
        res.status(200).json(response);
    } catch (error) {   
        res.status(500).json(error.message);
    }
}

export const changeState = async (req, res) => {
    const { id, state } = await req.body;
    try {
        const invoiceData = await Invoice.findById(id);
        invoiceData.set({ state: state });
        invoiceData.save();
        res.status(200).json(invoiceData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const changePayment = async (req, res) => {
    const { id, payment } = await req.body;
    try {
        const invoiceData = await Invoice.findById(id);
        invoiceData.set({ payment: payment });
        invoiceData.save();
        res.status(200).json(invoiceData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}
