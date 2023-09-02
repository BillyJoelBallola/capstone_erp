import { User } from "../Models/UserModel.js";
import { Customer } from "../Models/CustomerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import '../config.js';

export const login = async (req, res) => {
    const { email, password } = await req.body;
    const userData = await User.findOne({ email });
    
    if(!userData?.status){
        res.json("You are signing in an inactive account.");
    }else{
        if(userData){
            const correctPass = bcrypt.compareSync(password, userData.password);
            if(correctPass){
                jwt.sign({ role: userData.role, status: userData.status, name: userData.name, password: userData.password, email: userData.email, id: userData._id, userAccess: userData.userAccess }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie("token", token);
                    res.status(200).json(userData);
                });
            }else{
                res.json("Incorrect Password");
            }
        }else{
            res.json("User not found");
        } 
    }
   
}

export const customerLogin = async (req, res) => {
    const { email, password } = await req.body;
    const customerData = await Customer.findOne({ email });
    
    if(customerData){
        if(customerData.state === 2){
            const correctPass = bcrypt.compareSync(password, customerData.account.password);
            if(correctPass){
            jwt.sign({ id: customerData._id, name: customerData.name, business: customerData.business, email: customerData.email, address: customerData.address, account: customerData.account, contact: customerData.contact }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie("portal_token", token);
                    res.status(200).json(customerData);
                });
            }else{
                res.json("Incorrect Password");
            }
        }else{
            res.json("Account has not been confirmed yet.");
        }
    }else{
        res.json("User not found");
    } 
}

export const customerLogout = (req, res) => {
	res.cookie("portal_token", "").json(true);
};

export const logout = (req, res) => {
	res.cookie("token", "").json(true);
};