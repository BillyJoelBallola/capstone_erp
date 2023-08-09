import { Schema, model } from "mongoose";

const DeductionSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    amount: {
        type: Number, 
        required: true
    }
})

export const Deduction = model("Deduction", DeductionSchema);

