import { Hono } from "hono";
import { registerResident, residentLogin } from "../controllers/resident.controller"
import { residentAuth } from "../middleware/resident.auth.middleware";
import { raiseComplaint } from "../controllers/resident.controller";
import { getMyComplaints } from "../controllers/resident.controller";
import { getAnnouncements } from "../controllers/resident.controller";
import { getWaterStatus } from "../controllers/resident.controller";

const residentRoutes = new Hono();

residentRoutes.post("/register", registerResident);
residentRoutes.post("/login",residentLogin)
residentRoutes.post("/complaint", residentAuth, raiseComplaint);
residentRoutes.get("/complaints", residentAuth, getMyComplaints);
residentRoutes.get(
  "/announcements",
  residentAuth,
  getAnnouncements
);
residentRoutes.get(
  "/water-status",
  residentAuth,
  getWaterStatus
);


export default residentRoutes;
