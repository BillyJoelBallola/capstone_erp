import { Schema, model } from "mongoose";

const DepartmentSchema = new Schema({
    name: { type: String, required: true }
})

export const Department = model("Department", DepartmentSchema);