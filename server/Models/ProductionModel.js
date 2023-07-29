import { model, Schema } from "mongoose";

const ProductionSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    reference: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    state: {
        type: Number,
        required: true
    },
    automate: {
        type: Boolean,
    }
});

export const Production = model("Production", ProductionSchema);