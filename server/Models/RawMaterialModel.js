import { model, Schema } from "mongoose";

const RawMaterialSchema = Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    measurement: {
        type: String, 
        required: true, 
    },
    quantity: {
        type: Number, 
        default: 0,
    },
    price: {
        type: Number,
        required: true
    },
    storage: {
        type: Schema.Types.ObjectId, 
        ref: "Storage", 
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

export const RawMaterial = model("RawMaterial", RawMaterialSchema);