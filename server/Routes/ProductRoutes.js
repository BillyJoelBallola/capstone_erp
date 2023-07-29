import { Router } from "express";
import { addProduct, adjustProduct, deleteProduct, getAllProducts, getProduct, updateManyProducts, updateProductImage, updateProduct } from "../Controllers/ProductController.js";

const route = Router();

route.post("/erp/add_product", addProduct);
route.put("/erp/update_product", updateProduct);
route.put("/erp/update_many_products", updateManyProducts);
route.put("/erp/adjust_product", adjustProduct);
route.put("/erp/update_img_product", updateProductImage);
route.get("/erp/products", getAllProducts);
route.get("/erp/product/:id", getProduct);
route.delete("/erp/delete_product/:id", deleteProduct);

export default route;