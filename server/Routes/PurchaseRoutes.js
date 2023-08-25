import { Router } from "express";
import { addPurchase, changeState, getAllPurchase, getPurchase, purchasePlanning, replenishMaterial, updatePurchase } from "../Controllers/PurchaseController.js";

const route = Router();

route.post("/erp/add_purchase", addPurchase);
route.post("/erp/replenish_purchase", replenishMaterial);
route.put("/erp/update_purchase", updatePurchase);
route.put("/erp/change_purchase_state", changeState);
route.get("/erp/purchases", getAllPurchase);
route.get("/erp/purchase/:id", getPurchase);
route.get("/erp/purchase_planning", purchasePlanning);

export default route;