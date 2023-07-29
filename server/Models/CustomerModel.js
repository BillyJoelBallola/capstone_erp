import { model, Schema } from "mongoose";

const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    business: {
        type: String, 
    },
    email: {type: String, required: true},
    address: {
        street: {type: String},
        barangay: {type: String},
        municipal: {type: String, required: true},
        province: {type: String, required: true},
        country: {type: String, required: true},
    },
    account: {
        image: {type: String},
        password: {type: String, required: true},
    },
    contact: {
        phoneNumber: {type: Number, required: true}
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

export const Customer = model("Customer", CustomerSchema);