import { Hono } from "hono";
import { cors } from "hono/cors"; // <--- 1. Import CORS
import adminOperatorRoutes from "./routes/admin.operator.route";
import authRoutes from "./routes/auth.route";
import operatorRoutes from "./routes/operator.route";   
import dailyLogRoutes from "./routes/dailylog.route";
import adminDashboardRoutes from "./routes/admin.dashboard.routes";
import residentRoutes from "./routes/resident.route";
import simulationRoutes from "./routes/simulator.routes";
import adminRoutes from "./routes/admin.route";

const app = new Hono();

// --- 2. ENABLE CORS (MUST BE BEFORE ROUTES) ---
app.use(
  "/*",
  cors({
origin: "*", // <--- ALLOW EVERYONE (Fixes the blocking)    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
   allowHeaders: ["Content-Type", "Authorization"], 
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// root test
app.get("/", (c) => c.text("API running"));

// admin routes
app.route("/auth", authRoutes);
//app.route("/admin", adminOperatorRoutes);
app.route("/admin", adminRoutes);
app.route("/admin/dashboard", adminDashboardRoutes);

// operator routes 
app.route("/operator", operatorRoutes);

// daily logs route 
app.route("/operator/daily-log", dailyLogRoutes);

// resident routes
app.route("/resident", residentRoutes);


app.route("/simulation", simulationRoutes);

export default {
  port: 3000,
  fetch: app.fetch,
};