import { Router } from "express";
import { addDepartment, getAllDepartments } from "../Controllers/DepartmentController.js";

const route = Router();

route.post("/erp/add_department", addDepartment);
route.get("/erp/departments", getAllDepartments);

export default route;