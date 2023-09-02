import { Customer } from '../Models/CustomerModel.js';
import { Cart } from '../Models/CartModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const brcyptSalt = bcrypt.genSaltSync(10);

// stata: 1 -> Request, 2 -> Confirmed

export const addCustomer = async (req, res) => {
    const { name, business, address, email, contact, account } = await req.body;
    const customerData = await Customer.findOne({ email });
    if(customerData) return res.json("Email already registered.");
    try {
        const newCustomer = await Customer.create({
            name,
            business,
            email, 
            address,
            contact,
            account: {
                ...account,
                password: bcrypt.hashSync(account.password, brcyptSalt)
            },
            state: 1
        });
        res.status(200).json(newCustomer);
    } catch (error) {
        res.json("Failed to register.");        
    }
}

export const customerProfile = async (req, res) => {
    const { portal_token } = await req.cookies;
    if(portal_token){
        jwt.verify(portal_token, process.env.JWT_SECRET, {}, async (err, data) => {
            if(err) throw err;
            const customerLogged = await Customer.findById(data.id);
            const { name, business, address, email, contact, account, _id } = customerLogged;
            res.json({ name, business, address, email, contact, account, _id });
        })
    }else{   
        res.json(null);
    }
}

export const updateCustomerInformation = async (req, res) => {
    const { id, name, business, address, contact } = await req.body;
    const customerData = await Customer.findById(id);
    try {
        customerData.set({
            name,
            business,
            address,
            contact
        })
        customerData.save();
        res.status(200).json(customerData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getCustomerCart = async (req, res) => {
    const { customerId } = await req.params;
    try {
        const cartData = await Cart.findOne({ customer: customerId });
        res.status(200).json(cartData);
    } catch (error) {
        res.status(500).json(error.message);
    }
} 

export const addCartItem = async (req, res) => {
    const { data, id } = await req.body;
    const cartData = await Cart.findById(id);
    let prodData = {};
    let cart = [];
    let productExisted = false;

    cartData.cart.map(item => {
        if(item.productId === data.productId){
            prodData = item;
            productExisted = true;
        }
    })

    const updateItemsInCard = (array, valueToMatch, updatedObject) => {
        return array.map((obj) => {
            if (obj.productId === valueToMatch) {
                return updatedObject;
            }
            return obj;
        });
    };  

    try {
        if(productExisted){
            prodData = {
                ...prodData,
                totalPrice: (prodData.quantity + 1) * data.totalPrice,
                quantity: prodData.quantity + data.quantity
            }
            const newData = updateItemsInCard(cartData.cart, data.productId, prodData);
            cart = newData;
        }else{
            cart = [ ...cartData.cart, data];
        }
        cartData.set({ cart: cart });
        cartData.save();
        res.status(200).json(cartData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const removeCartItem = async (req, res) => {
    const { id, index } = await req.body;
    const cartData = await Cart.findById(id);
    const newCartItems = cartData?.cart?.splice(1 - index, 1);
    try {
        cartData.set({ cart: newCartItems });
        cartData.save();
        res.status(200).json(cartData);
    } catch (error) {    
        res.status(500).json(error.message);
    }
}

export const updateCartItem = async (req, res) => {
    const { id, cart } = await req.body;
    const cartData = await Cart.findById(id);
    try {
        cartData.set({ cart: cart });
        cartData.save();
        res.status(200).json(cartData);
    } catch (error) {    
        res.status(500).json(error.message);
    }
}

export const addCustomerCart = async (req, res) => {
    const { customerId } = await req.body;
    try {
        const newCart = await Cart.create({
            customer: customerId,
            cart: []
        })
        res.status(200).json(newCart);
    } catch (error) {
        res.status(500).json(error.message);
    }
} 

export const getAllCustomers = async (req, res) => {
    try {
        const response = await Customer.find({});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getCustomerById = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Customer.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const changeState = async (req, res) => {
    const { id, state } = await req.body;
    try {
        const customerData = await Customer.findById(id);
        customerData.set({ state });
        customerData.save();
        res.status(200).json(customerData);
    } catch (error) {
        res.status(500).json(error.message);
    }
}