import { Router } from "express";
import { addEmployee, getAllEmployees, getEmployeeById, updateEmployee, updateManyEmployee } from "../Controllers/EmployeeController.js";

const route = Router();

route.post("/erp/add_employee", addEmployee);
route.put("/erp/update_employee", updateEmployee);
route.put("/erp/update_many_employees", updateManyEmployee);
route.get("/erp/employees", getAllEmployees);
route.get("/erp/employee/:id", getEmployeeById);

export default route;