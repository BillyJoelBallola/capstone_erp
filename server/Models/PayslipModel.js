import { Schema, model } from "mongoose";

const PayslipSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    payment: {
        type: Number,
    },
    paymentData: {
        type: Object,    
    },
    amountDue: {
        type: Number,
    },
    earning: {
        type: Number,
    },
    date: {    
        type: Date,
        required: true
    },
    toDate: {    
        type: Date,
    },
    fromDate: {    
        type: Date,
    },
    gross: {
        type: Number,
        required: true
    },
    deduction: {
        type: Number,
        required: true
    },
    netPay: {
        type: Number,
        required: true
    },
    state: {
        type: Number
    }
});

export const Payslip = model("Payslip", PayslipSchema);