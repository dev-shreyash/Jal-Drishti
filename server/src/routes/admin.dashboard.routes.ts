import { Hono } from "hono";
import { dailyUsageSummary, getAiPredictions, getDashboardStats } from "../controllers/admin.dashboard.controller";
import { analyticsSummary, pumpUsage, dailyTrend, shortageAlert } from "../controllers/admin.analytics.controller";

import { adminAuth } from "../middleware/auth.middleware";

const adminDashboardRoutes = new Hono();


adminDashboardRoutes.get(
  "/daily-usage",
  adminAuth,
  dailyUsageSummary
);

adminDashboardRoutes.get("/analytics/summary", adminAuth, analyticsSummary);
adminDashboardRoutes.get("/analytics/pump-usage", adminAuth, pumpUsage);
adminDashboardRoutes.get("/analytics/daily-trend", adminAuth, dailyTrend);
adminDashboardRoutes.get("/analytics/alerts", adminAuth, shortageAlert);

adminDashboardRoutes.get("/stats", adminAuth, getDashboardStats);
// Add this line inside your routes file
adminDashboardRoutes.get("/ai-predict-usage", adminAuth, getAiPredictions);



export default adminDashboardRoutes;
