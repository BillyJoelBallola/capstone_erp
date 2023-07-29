import { Router } from "express";
import { addShipment, changeStaste, getAllShipments, getShipementById, updateShipment } from "../Controllers/ShipmentController.js";

const route = Router();

route.post("/erp/add_shipment", addShipment);
route.put("/erp/update_shipment", updateShipment);
route.put("/erp/change_shipment_state", changeStaste);
route.get("/erp/shipments", getAllShipments);
route.get("/erp/shipment/:id", getShipementById);

export default route;