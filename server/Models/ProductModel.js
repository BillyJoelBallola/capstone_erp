import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
    productImg: { type: String}, 
    name: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rawMaterials: [Object],
    category: {
        type: Schema.Types.ObjectId, 
        ref: "Category", 
        required: true
    },
    measurement: {
        type: String, 
        required: true, 
    },
    quantity: {
        type: Number, 
        default: 0,
    },
    price: {
        type: Number,
        required: true
    },
    status: { 
        type: Boolean,
        required: true
    },
    instructions: [String],
    storage: {
        type: Schema.Types.ObjectId, 
        ref: "Storage", 
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

export const Product = model("Product", ProductSchema);