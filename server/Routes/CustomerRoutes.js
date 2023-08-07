import { Router } from "express";
import { addCartItem, addCustomer, addCustomerCart, customerProfile, getAllCustomers, getCustomerById, getCustomerCart, removeCartItem, updateCartItem, updateCustomerInformation } from "../Controllers/CustomerController.js";

const route = Router();

route.post("/erp/add_customer", addCustomer);
route.post("/erp/add_cart", addCustomerCart);
route.put("/erp/update_customer_information", updateCustomerInformation);
route.put("/erp/remove_cart_item", removeCartItem);
route.put("/erp/add_cart_item", addCartItem);
route.put("/erp/change_cart_item", updateCartItem);
route.get("/erp/customer_profile", customerProfile);
route.get("/erp/customer_cart/:customerId", getCustomerCart);
route.get("/erp/customers", getAllCustomers);
route.get("/erp/customer/:id", getCustomerById);

export default route;