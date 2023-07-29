import { Router } from "express";
import { addPayment, getAllPayments, getPaymentById, updatePayment } from "../Controllers/PaymentController.js";

const route = Router();

route.post("/erp/add_payment", addPayment);
route.put("/erp/update_payment", updatePayment);
route.get("/erp/payments", getAllPayments);
route.get("/erp/payment/:id", getPaymentById);

export default route;