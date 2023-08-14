import { Router } from "express";
import { addAdjustment, getAdjustmentByItemId, getAllAdjustments } from "../Controllers/AdjustmentController.js";

const route = Router();
 
route.post("/erp/add_adjustment", addAdjustment);
route.get("/erp/adjustments", getAllAdjustments);
route.get("/erp/adjustment/:itemId", getAdjustmentByItemId);

export default route;
