import moment from "moment";
import { Payslip } from "../Models/PayslipModel.js";

// payment: 1 -> Not paid, 2 -> Partially Paid, 3 -> Paid

export const addPayslip = async (req, res) => {
    const { employee, reference, earning, gross, deduction, netPay, toDate, fromDate } = await req.body;
    try {
        const newPayslip = await Payslip.create({
            reference,
            employee,
            earning,
            date: Date.now(),
            toDate,
            fromDate,
            gross,
            deduction,
            netPay,
            payment: 1,
            state: 1,
            paymentData: null
        });
        res.status(200).json(newPayslip);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updatePayslip = async (req, res) => {
    const { id, earning, gross, deduction, netPay, toDate, fromDate } = await req.body;
    try {
        const payslipData = await Payslip.findById(id);
        payslipData.set({
            earning,
            gross,
            deduction,
            netPay,
            toDate,
            fromDate
        });
        payslipData.save();
        res.status(200).json(payslipData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateSlipPayment = async (req, res) => {
    const { id, payment, user, amount, date, amountDue } = await req.body;
    let paymentArray = [];
    try {
        const payslipData = await Payslip.findById(id);

        if(payslipData.paymentData === null){
            paymentArray.push({ amount, date, user });
        }else{
            paymentArray = [
                ...payslipData.paymentData,
                { amount, date, user }
            ]
        }

        payslipData.set({ 
            payment,
            amountDue: payment === 2 ? amountDue : 0,
            paymentData: paymentArray
        });
        payslipData.save();
        res.status(200).json(payslipData);
    } catch (error) {
        res.status(500).json(error.message);
    }
} 

export const changeState = async (req, res) => {
    const { id, state } = await req.body;
    try {
        const payslipData = await Payslip.findById(id);
        payslipData.set({ state });
        payslipData.save();
        res.status(200).json(payslipData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getAllPayslips = async (req, res) => {
    try {
        const response = await Payslip.find({}).populate("employee");
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    } 
}

export const getPayslipById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Payslip.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    } 
}