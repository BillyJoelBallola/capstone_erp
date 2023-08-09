import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    type: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        barangay: { type: String, required: true },
        municipal: { type: String, required: true },
        province: { type: String, required: true },
        country: { type: String, required: true },
    },
    contact: {
        email: { type: String, unique: true },
        phoneNumber: { type: String, required: true },
    },
    emergency: {
        name: { type: String, unique: true },
        phoneNumber: { type: String, required: true },
    },
    position: { type: Schema.Types.ObjectId, ref: "Position", required: true },
    salary: { type: String },
    deductions: [Object],
    status: {
        type: Boolean
    }
});

export const Employee = model("Employee", EmployeeSchema);