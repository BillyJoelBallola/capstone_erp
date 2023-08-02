import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
    reference: {
        type: String,
        required: true
    },
    customer:{
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    receiveDate: {
        type: Date
    },
    orders: [Object],
    state: {
        type: Number
    },
    invoice: {
        type: Number
    },
    total: {
        type:Number
    }
});

export const Order = model("Order", OrderSchema);