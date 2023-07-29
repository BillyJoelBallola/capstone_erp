import { Router } from "express";
import { customerLogin, customerLogout, login, logout } from "../Controllers/AuthController.js";

const route = Router();

route.post("/erp/login", login);
route.post("/erp/customer_login", customerLogin);
route.post("/erp/customer_logout", customerLogout);
route.post("/erp/logout", logout);

export default route;