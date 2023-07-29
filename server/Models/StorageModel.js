import { Schema, model } from "mongoose";

const StorageSchema = new Schema({
    name: { type: String,  required: true, unique: true }
})

export const Storage = model("Storage", StorageSchema);