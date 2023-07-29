import { model, Schema } from "mongoose";

const PurchaseModel = new Schema({
    supplier:{
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        requared: true
    },
    reference: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    expectedArrival: {
        type: Date,
        required: true
    },
    materials: [Object],
    total: {
        type: Number,
        required: true
    },
    state: {
        type: Number,
        required: true
    },
    automate: {
        type: Boolean
    }
});

export const Purchase = model("Purchase", PurchaseModel);