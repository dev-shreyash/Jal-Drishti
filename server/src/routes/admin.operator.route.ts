import { Hono } from "hono";
import { registerOperator,handleChangeRequest } from "../controllers/admin.operator.controller";
import { adminAuth } from "../middleware/auth.middleware";

const adminOperatorRoutes = new Hono();

// test route (IMPORTANT)
adminOperatorRoutes.get("/ping", (c) =>
  c.json({ message: "Admin route working" })
);

// main API - protected with admin auth
adminOperatorRoutes.post("/operators", adminAuth, registerOperator);
adminOperatorRoutes.post(
  "/change-request/:requestId/action",
  adminAuth,
  handleChangeRequest
);

export default adminOperatorRoutes;