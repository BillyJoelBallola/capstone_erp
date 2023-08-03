import { Schema, model } from "mongoose";

const InvoiceSchema = new Schema({
    reference: {
        type: String,
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    productOrder: [Object],
    date: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    journal: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    state: {
        type: Number
    },
    payment: {
        type: Number
    }
});

export const Invoice = model("Invoice", InvoiceSchema);