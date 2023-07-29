import { Router } from "express";
import { addBill, changePayment, changeState, getAllBill, getBillById, getPurchasedBill, updateBill } from "../Controllers/BillController.js";

const route = Router();

route.post("/erp/add_bill", addBill);
route.put("/erp/update_bill", updateBill);
route.put("/erp/change_bill_state", changeState);
route.put("/erp/change_bill_payment", changePayment);
route.get("/erp/bills", getAllBill);
route.get("/erp/bill/:id", getBillById);
route.get("/erp/purchased_bill/:id", getPurchasedBill);

export default route;