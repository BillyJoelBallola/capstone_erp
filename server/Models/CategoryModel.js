import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String,  required: true, unique: true }
})

export const Category = model("Category", CategorySchema);