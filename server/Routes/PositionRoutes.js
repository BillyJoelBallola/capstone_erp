import { Router } from "express";
import { addPosition, getAllPositions } from "../Controllers/PositionController.js";

const route = Router();

route.post("/erp/add_position", addPosition);
route.get("/erp/positions", getAllPositions);

export default route;