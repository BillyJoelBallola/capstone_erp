import { Schema, model } from "mongoose";

const LeaveSchema = new Schema({
    holiday:{
        name: { type: String },
        date: { type: Date },
    },
    Leave: {
        name: { type: String },
        date: { type: Date },
    }
});

export const Leave = model("Leave", LeaveSchema);