import { Router } from "express";
import { addSupplier, getAllSuppliers, getSupplierById, supplierOnTimeRate, updateSupplier } from "../Controllers/SupplierController.js";

const route = Router();

route.post("/erp/add_supplier", addSupplier);
route.put("/erp/update_supplier", updateSupplier);
route.get("/erp/suppliers", getAllSuppliers);
route.get("/erp/supplier/:id", getSupplierById);
route.get("/erp/supplier_time-rate", supplierOnTimeRate);

export default route;