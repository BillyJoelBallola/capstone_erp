import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import './config.js'
import './dbConnect.js';

import UserRoutes from "./Routes/UserRoutes.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import ProfileRoutes from "./Routes/ProfileRoutes.js";
import StorageRoutes from "./Routes/StorageRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import RawMaterialRoutes from "./Routes/RawMaterialRoutes.js";
import SupplierRoutes from "./Routes/SupplierRoutes.js";
import ProductionRoutes from "./Routes/ProductionRoutes.js";
import PurchaseRoutes from "./Routes/PurchaseRoutes.js";
import AdjustmentRoutes from "./Routes/AdjustmentRoutes.js";
import BillRoutes from "./Routes/BillRoutes.js";
import PaymentRoutes from "./Routes/PaymentRoutes.js";
import UploadRoutes from "./Routes/UploadRoutes.js";
import CustomerRoutes from "./Routes/CustomerRoutes.js";
import OrderRoutes from "./Routes/OrderRoutes.js";
import CategoryRoutes from "./Routes/CategoryRoutes.js";
import ShipmentRoutes from "./Routes/ShipmentRoutes.js";
import InvoiceRoutes from "./Routes/InvoiceRoutes.js";
import PositionRoutes from "./Routes/PositionRoutes.js";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";
import DeductionRoutes from "./Routes/DeductionRoutes.js";
import AttendanceRoutes from "./Routes/AttendanceRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173","http://localhost:5174"]
}));
app.use('/uploads', express.static('uploads'));

app.use(UserRoutes);
app.use(AuthRoutes);
app.use(ProfileRoutes);
app.use(StorageRoutes);
app.use(ProductRoutes);
app.use(RawMaterialRoutes);
app.use(SupplierRoutes);
app.use(ProductionRoutes);
app.use(PurchaseRoutes);
app.use(AdjustmentRoutes);
app.use(BillRoutes);
app.use(PaymentRoutes);
app.use(UploadRoutes);
app.use(CustomerRoutes);
app.use(OrderRoutes);
app.use(CategoryRoutes);
app.use(ShipmentRoutes);
app.use(InvoiceRoutes);
app.use(PositionRoutes);
app.use(EmployeeRoutes);
app.use(DeductionRoutes);
app.use(AttendanceRoutes);

const PORT = process.env.SERVER_PORT || 4000;

app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));