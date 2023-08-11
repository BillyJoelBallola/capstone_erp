import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    timeIn: {
        type: Date,
    },
    timeOut: {
        type: Date,
    }
});

export const Attendance = model("Attendance", AttendanceSchema);