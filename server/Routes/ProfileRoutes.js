import { Router } from "express";
import { profile } from "../Controllers/ProfileController.js";

const route = Router();

route.get("/erp/profile", profile);

export default route;