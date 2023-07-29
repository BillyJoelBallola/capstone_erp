import { Schema, model } from "mongoose";

const BankSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    holder: {
        type: String,
        required: true
    }
});

export const Bank = model("Bank", BankSchema);