import { Router } from "express";
import { addAdjustment, getAllAdjustments } from "../Controllers/AdjustmentController.js";

const route = Router();
 
route.post("/erp/add_adjustment", addAdjustment);
route.get("/erp/adjustments", getAllAdjustments);

export default route;
