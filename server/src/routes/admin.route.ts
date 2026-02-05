import { Hono } from "hono";
import { Context } from "hono";
import prisma from "../db";
import { adminAuth } from "../middleware/auth.middleware";

// 1. Import The New Controllers
import { getPumps, createPump, updatePump, deletePump } from "../controllers/pump.controller";
import { getTanks, createTank, updateTank, deleteTank } from "../controllers/tank.controller";
import { getOperators, createOperator, updateOperator, deleteOperator } from "../controllers/operator.controller";
import { getAiInsights, getDashboardStats } from "../controllers/admin.dashboard.controller";

const adminRoutes = new Hono();

// 2. Protect All Routes
adminRoutes.use("*", adminAuth);

/* ---------------- VILLAGES ---------------- */
adminRoutes.get("/villages", async (c: Context) => {
  const villages = await prisma.village.findMany({ orderBy: { village_id: "desc" } });
  return c.json(villages);
});

adminRoutes.post("/villages", async (c: Context) => {
  const data = await c.req.json();
  const village = await prisma.village.create({
    data: {
      village_name: data.village_name,
      district: data.district,
      taluka: data.taluka,
      state: data.state,
      pincode: data.pincode,
      population: Number(data.population),
    },
  });
  return c.json(village);
});

// ... (Keep PUT/DELETE village logic if you have it) ...
adminRoutes.get("/dashboard/stats", getDashboardStats);
adminRoutes.get("/dashboard/ai-insights", getAiInsights);

/* ---------------- 👇 NEW ROUTES: ASSETS (PUMPS) ---------------- */
adminRoutes.get("/pumps", getPumps);
adminRoutes.post("/pumps", createPump);
adminRoutes.put("/pumps/:id", updatePump);
adminRoutes.delete("/pumps/:id", deletePump);


/* ---------------- 👇 NEW ROUTES: ASSETS (TANKS) ---------------- */
adminRoutes.get("/tanks", getTanks);
adminRoutes.post("/tanks", createTank);
adminRoutes.put("/tanks/:id", updateTank);
adminRoutes.delete("/tanks/:id", deleteTank);


/* ---------------- 👇 NEW ROUTES: OPERATORS ---------------- */
adminRoutes.get("/operators", getOperators);
adminRoutes.post("/operators", createOperator);
adminRoutes.put("/operators/:id", updateOperator);
adminRoutes.delete("/operators/:id", deleteOperator);


export default adminRoutes;