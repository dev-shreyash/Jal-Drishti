import { Hono } from "hono";
import { operatorLogin } from "../controllers/operator.controller";
import { getPumpByQr } from "../controllers/pump.controller";
import { createDailyLog } from "../controllers/dailylog.controller";
import { operatorAuthMiddleware } from "../middleware/operator.auth.middleware";

const operatorRoutes = new Hono();

operatorRoutes.post("/login", operatorLogin);
operatorRoutes.get(
  "/pump/:qrCode",
  operatorAuthMiddleware,
  getPumpByQr
);


export default operatorRoutes;
