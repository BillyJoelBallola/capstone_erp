import moment from "moment";
import { Payslip } from "../Models/PayslipModel.js";

// payment: 1 -> Not paid, 2 -> Partially Paid, 3 -> Paid

export const addPayslip = async (req, res) => {
    const { employee, reference, earning, gross, deduction, netPay } = await req.body;
    try {
        const newPayslip = await Payslip.create({
            reference,
            employee,
            earning,
            date: Date.now(),
            gross,
            deduction,
            netPay,
            payment: 1
        });
        res.status(200).json(newPayslip);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updatePayslip = async (req, res) => {
    const { id, earning, gross, deduction, netPay } = await req.body;
    try {
        const payslipData = await Payslip.findById(id);
        payslipData.set({
            earning,
            gross,
            deduction,
            netPay
        });
        payslipData.save();
        res.status(200).json(payslipData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateSlipPayment = async (req, res) => {
    const { id, payment } = await req.body;
    try {
        const payslipData = await Payslip.findById(id);
        payslipData.set({ payment });
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