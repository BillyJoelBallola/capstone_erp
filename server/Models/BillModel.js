import { model, Schema } from "mongoose";

const BillSchema = new Schema({
    reference: {
        type: String,
        required: true
    },
    purchase: {
        type: Schema.Types.ObjectId,
        ref: "Purchase",
        required: true
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
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
    purchaseOrder: [Object],
    state: {
        type: Number
    },
    payment: {
        type: Number
    }
});

export const Bill = model("Bill", BillSchema);