import { Schema, model } from "mongoose";

// payment: 1 -> Not paid, 2 -> Partially Paid, 3 -> Paid

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
    earning: {
        type: Number,
    },
    date: {    
        type: Date,
        required: true
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
    }
});

export const Payslip = model("Payslip", PayslipSchema);