import { Router } from "express";
import { addUser, changePassword, getAllUsers, getUser, updateManyUsers, updateUser } from "../Controllers/UserController.js";

const route = Router();

route.get("/erp/users", getAllUsers);
route.get("/erp/user/:id", getUser);
route.put("/erp/update_many_users", updateManyUsers);
route.put("/erp/change_password", changePassword);
route.post("/erp/add_user", addUser);
route.put("/erp/update_user", updateUser);

export default route;