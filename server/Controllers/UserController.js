import { User } from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import '../config.js';

const brcyptSalt = bcrypt.genSaltSync(10);

export const addUser = async (req, res) => {
    const { name, email, password, role, userAccess, userImage } = await req.body;
    try {
        const newUserData = await User.create({
            userImage: userImage || null,
            name: name,
            email: email,
            role: role ? "Administrator" : "User",
            status: true,
            password: bcrypt.hashSync(password, brcyptSalt),
            userAccess: userAccess,
        })
        res.status(200).json(newUserData);
    } catch (error) {
        res.json(error.message);
    }
}

export const changePassword = async (req, res) => {
    const { email, password } = await req.body;
    const userData = await User.findOne({ email: email });
    try {
        userData.set({ password: bcrypt.hashSync(password, brcyptSalt) });
        userData.save();
        res.status(200).json(userData);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateUser = async (req, res) => {
    const { name, email, password, status, role, userAccess, userImage, _id} = await req.body;
    const userData = await User.findById(_id); 
    try {
        userData.set({
            userImage: userImage || null,
            name: name,
            email: email,
            role: role ? "Administrator" : "User",
            status: status,
            password: password,
            userAccess: userAccess,
        })
        userData.save();
        res.status(200).json(userData);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateManyUsers = async (req, res) => {
    const { selectedRows, status } = await req.body;
    const ids = [];
    selectedRows?.map((item) => {
        if(!ids.includes(item._id)){
            ids.push(item._id);
        }
    })
    try {
        const response = await User.updateMany({ _id: { $in: ids }}, {$set: { status: status }})
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(200).json(allUsers);
    } catch (error) {
        res.json(error.message);
    }
}

export const getUser = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await User.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}