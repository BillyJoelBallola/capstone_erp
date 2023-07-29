import { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
    reference: {
        type: String,
        required: true
    },
    journal: {
        type: String,
        required: true
    },
    type: {
        send: { type: Boolean },
        receive: { type: Boolean },
    },
    bank: {
        type: Schema.Types.ObjectId,
        ref: "Bank",
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: "Bill",
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    memo: {
        type: String,
    },
    method: {
        type: String,
        required: true
    }
});

export const Payment = model("Payment", PaymentSchema);