import { Router } from "express";
import { getAllStorage, addStorage } from "../Controllers/StorageController.js";

const route = Router();

route.post("/erp/add_storage", addStorage);
route.get("/erp/storages", getAllStorage);

export default route;