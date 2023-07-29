import { Router } from "express";
import { addRawMaterial, adjustRawMaterial, deleteRawMaterial, getAllRawMaterials, getRawMaterial, updateRawMaterial } from "../Controllers/RawMaterialController.js";

const route = Router();

route.post("/erp/add_raw-material", addRawMaterial);
route.put("/erp/update_raw-material", updateRawMaterial);
route.put("/erp/adjust_raw-material", adjustRawMaterial);
route.get("/erp/raw-materials", getAllRawMaterials);
route.get("/erp/raw-material/:id", getRawMaterial);
route.delete("/erp/delete_raw-material/:id", deleteRawMaterial);

export default route;