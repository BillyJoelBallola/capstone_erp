import { Product } from "../Models/ProductModel.js";

export const addProduct = async (req, res) => {
    const { name, description, category, measurement, quantity, price, status, storage, productImg, rawMaterials, instructions } = await req.body;
    try {
        const newProduct = await Product.create({
            productImg,
            name,
            category,   
            description,
            rawMaterials,
            instructions,
            measurement,
            quantity,
            price,
            status,
            storage
        });
        res.status(200).json(newProduct);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateProduct = async (req, res) => {
    const { _id, name, description, category, measurement, quantity, price, status, storage, productImg, rawMaterials, instructions } = await req.body;
    const productData = await Product.findById(_id);
    try {
        productData.set({
            productImg,
            name,
            category, 
            description,
            rawMaterials,
            instructions,
            measurement,
            quantity,
            price,
            status,
            storage
        });
        productData.save();
        res.status(200).json(productData);
    } catch (error) {
        res.json(error.message);
    }
}

export const updateProductImage = async (req, res) => {
    const { uploadedImage, id } = await req.body;
    const productData = await Product.findById(id);
    try {
        if(productData.productImg !== ""){
            fs.unlink(`./uploads${productData.productImg}`, (err) => {
                if(err) throw err;
            });
        }
        productData.set({
            productImg: uploadedImage,
        });
        productData.save();
        res.status(200).json(productData);
    } catch (error) {   
        res.json(error.message);
    }
}

export const updateManyProducts = async (req, res) => {
    const { selectedRows, status } = await req.body;
    const ids = [];
    selectedRows?.map((item) => {
        if(!ids.includes(item._id)){
            ids.push(item._id);
        }
    })
    try {
        const response = await Product.updateMany({ _id: { $in: ids }}, {$set: { status: status }})
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Product.findByIdAndDelete(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}
 

export const getAllProducts = async (req, res) => {
    try {
        const response = await Product.find({}).populate("storage");
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const getProduct = async (req, res) => {
    const { id } = await req.params;
    try {
        const response = await Product.findById(id);
        res.status(200).json(response);
    } catch (error) {
        res.json(error.message);
    }
}

export const adjustProduct = async (req, res) => {
    const { item, quantity} = await req.body;
    const productData = await Product.findById(item._id);
    try {
        productData.set({
            quantity: quantity,
        })
        productData.save();
        res.status(200).json(productData);
    } catch (error) {
        res.json(error.message);
    }
}