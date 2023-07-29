import { Router } from "express";
import { addOrder, changeState, getAllOrders, getOrderById, getOrdersByCustomerId } from "../Controllers/OrderController.js";

const route = Router();

route.post("/erp/add_order", addOrder);
route.put("/erp/change_order_state", changeState);
route.get("/erp/customer_orders", getOrdersByCustomerId);
route.get("/erp/orders", getAllOrders);
route.get("/erp/order/:id", getOrderById);

export default route;