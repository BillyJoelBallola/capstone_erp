import { Payment } from "../Models/PaymentModel.js";

export const addPayment = async (req, res) => {
    const { reference, journal, bank, bill, supplier, type, customer, date, amount, memo, method } = await req.body;
    try {
        const newPayment = await Payment.create({
            reference,
            journal,
            bank: bank ? bank : null,
            bill,
            supplier,
            type,
            customer,
            date,
            amount,
            memo,
            method
        });
        res.status(200).json(newPayment);
    } catch (error) {
        res.json(error.message);
    }
}
export const updatePayment = async (req, res) => {
    const { id, memo } = await req.body;
    const paymentData = await Payment.findById(id);
    try {
        paymentData.set({ memo });
        paymentData.save();
        res.status(200).json(paymentData);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllPayments = async (req, res) => {
    try {
        const resposne = await Payment.find({}).populate("supplier").populate("customer").populate("bill");
        res.status(200).json(resposne);
    } catch (error) {
        res.json(error.message);
    }
}
export const getPaymentById = async (req, res) => {
    const { id } = await req.params;
    try {
        const resposne = await Payment.findById(id).populate("supplier").populate("customer").populate("bill");
        res.status(200).json(resposne);
    } catch (error) {
        res.json(error.message);
    }
}