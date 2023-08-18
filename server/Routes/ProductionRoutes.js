import { Router } from "express";
import { addProduction, addReplenishment, changeState, getAllProduction, getProduction, productionPlanning, updateProduction } from "../Controllers/ProductionController.js";

const route = Router();

route.post("/erp/add_production", addProduction);
route.post("/erp/production_replenish", addReplenishment);
route.put("/erp/change_production_state", changeState);
route.put("/erp/update_production", updateProduction);
route.get("/erp/productions", getAllProduction);
route.get("/erp/production/:id", getProduction);
route.get("/erp/production_planning", productionPlanning);

export default route; 