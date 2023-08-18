import { Router } from "express";
import { addOrder, changeState, getAllOrders, getOrderById, getOrdersByCustomerId, updateOrder } from "../Controllers/OrderController.js";

const route = Router();

route.post("/erp/add_order", addOrder);
route.put("/erp/update_order", updateOrder);
route.put("/erp/change_order_state", changeState);
route.get("/erp/customer_orders", getOrdersByCustomerId);
route.get("/erp/orders", getAllOrders);
route.get("/erp/order/:id", getOrderById);


export default route;