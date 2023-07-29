import { model, Schema } from "mongoose";

const AdjustmentSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    item: {
        type: Object,
        required: true
    },
    oldQuantity: {
        type: Number,
        required: true
    },
    newQuantity: {
        type: Number,
        required: true
    },
    remarks: {
        type: String, 
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

export const Adjustment = model("Adjustment", AdjustmentSchema);