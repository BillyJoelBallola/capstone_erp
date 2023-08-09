import { Schema, model } from "mongoose";

const PositionSchema = new Schema({
    name: { type: String, required: true }
})

export const Position = model("Position", PositionSchema);