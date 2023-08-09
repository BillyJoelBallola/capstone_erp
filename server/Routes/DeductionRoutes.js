import { Router } from "express";
import { addDeduction, getAllDeductions } from "../Controllers/DeductionController.js";

const route = Router();

route.post("/erp/add_deduction", addDeduction);
route.get("/erp/deductions", getAllDeductions);

export default route; 