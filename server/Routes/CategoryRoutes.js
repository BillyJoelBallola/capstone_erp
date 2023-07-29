import { Router } from "express";
import { addCategory, getAllCategory } from "../Controllers/CategoryController.js";

const route = Router();

route.post("/erp/add_category", addCategory);
route.get("/erp/categories", getAllCategory);

export default route;