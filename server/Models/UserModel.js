import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    userImage: { type: String },
    name: { type: String, required: true},
    email: { 
        type: String,
        required: true, 
        unique: true 
    },
    role: { type: String, required: true },
    password: { type: String, required: true}, 
    status: { type: Boolean, required: true}, 
    userAccess: [Object],
});

export const User = model("User", UserSchema); 