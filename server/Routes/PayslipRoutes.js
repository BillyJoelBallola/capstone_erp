import { Router } from "express";
import { addPayslip, changeState, getAllPayslips, getPayslipById, updatePayslip, updateSlipPayment } from "../Controllers/PayslipController.js";

const route = Router();

route.post("/erp/add_payslip", addPayslip);
route.put("/erp/update_payslip", updatePayslip);
route.put("/erp/change_payslip_payment", updateSlipPayment);
route.put("/erp/change_payslip_status", changeState);
route.get("/erp/payslips", getAllPayslips);
route.get("/erp/payslip/:id", getPayslipById);

export default route;