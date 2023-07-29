import { Schema, model } from "mongoose";

const ShipmentSchema = new Schema({
    reference: {
        type: String,
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    expectedArrival: {
        type: Date,
    },
    scheduledDate: {
        type: Date,
    },
    state: {
        type: Number
    }
})

export const Shipment = model("Shipment", ShipmentSchema);