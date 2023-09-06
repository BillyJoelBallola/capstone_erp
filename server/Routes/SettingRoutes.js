import { Router } from "express";
import { getSettings, updateSettings } from "../Controllers/SettingController.js";

const route = Router();

route.put("/erp/update_settings", updateSettings);
route.get("/erp/settings", getSettings);

export default route;