import { Router } from "express";
import { addInvoice, changePayment, changeState, getAllInvoice, getInvoiceById, updateInvoice } from "../Controllers/InvoiceController.js";

const route = Router();

route.post("/erp/add_invoice", addInvoice);
route.put("/erp/update_invoice", updateInvoice);
route.put("/erp/change_invoice_state", changeState);
route.put("/erp/change_invoice_payment", changePayment);
route.get("/erp/invoices", getAllInvoice);
route.get("/erp/invoice/:id", getInvoiceById);

export default route;