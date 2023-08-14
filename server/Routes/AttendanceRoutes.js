import { Router } from "express";
import { getAllAttendance, getAttendanceById, getCurrentAttendance, timeInAttendance, timeOutAttendance } from "../Controllers/AttendanceController.js";

const route = Router();

route.post("/erp/timeIn_attendance", timeInAttendance);
route.put("/erp/timeOut_attendance", timeOutAttendance);
route.get("/erp/current_attendance", getCurrentAttendance);
route.get("/erp/attendance", getAllAttendance);
route.get("/erp/date_id_attendance/:employeeId", getAttendanceById);

export default route;