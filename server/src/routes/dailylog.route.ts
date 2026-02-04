import { Hono } from "hono";
import { createDailyLog } from "../controllers/dailylog.controller";
import { operatorAuthMiddleware } from "../middleware/operator.auth.middleware";

const dailyLogRoutes = new Hono();

dailyLogRoutes.post(
  "/",
  operatorAuthMiddleware,
  createDailyLog
);

export default dailyLogRoutes;
