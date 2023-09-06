import { Schema, model } from "mongoose";

const SettingSchema = new Schema({
    inventory: {
        storage: { type: Object },
        productMin: { type: Number },
        productMax: { type: Number }
    },
    shared: {
        productionMin: { Type: Number }
    },
    humanResource: {
        departments: { type: Object },
        holidays: { type: Object },
        leaves: { type: Object },
        deductions: { type: Object },
        earnings: { type: Object },
    },
    financial: {
        journals: { type: Object },
        paymentMethod: { type: Object }
    }
});

export const Setting = model("Setting", SettingSchema);