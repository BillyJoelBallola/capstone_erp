import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    cart: [Object]
});

export const Cart = model("Cart", CartSchema);