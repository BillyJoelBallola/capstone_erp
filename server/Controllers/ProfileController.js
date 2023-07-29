import { User } from "../Models/UserModel.js";
import jwt from 'jsonwebtoken';

export const profile = async (req, res) => {
    const { token } = await req.cookies;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const userLogged = await User.findOne({ _id: data.id });
            const { name, email, _id, password, userImage, userAccess } = userLogged;
            res.json({ name, email, _id, password, userImage, userAccess });
        })
    }else{   
        res.json(null);
    }
}