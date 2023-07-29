import { model, Schema } from "mongoose";

const SupplierSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    business: {
        type: String, 
        required: true, 
    },
    address: {
        street: {type: String},
        barangay: {type: String},
        municipal: {type: String, required: true},
        province: {type: String, required: true},
        country: {type: String, required: true},
    },
    contact:{
        email: {type: String},
        phoneNumber: {type: Number, required: true},
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

export const Supplier = model("Supplier", SupplierSchema);