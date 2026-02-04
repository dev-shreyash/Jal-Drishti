import { Hono } from "hono";
import adminOperatorRoutes from "./routes/admin.operator.route";
import authRoutes from "./routes/auth.route";
import operatorRoutes from "./routes/operator.route";   
import dailyLogRoutes from "./routes/dailylog.route";
import adminDashboardRoutes from "./routes/admin.dashboard.routes";
import residentRoutes from "./routes/resident.route";

const app = new Hono();

// root test
app.get("/", (c) => c.text("API running"));

// admin routes

app.route("/auth", authRoutes);
app.route("/admin", adminOperatorRoutes);
app.route("/admin/dashboard", adminDashboardRoutes);


//operator routes 
app.route("/operator", operatorRoutes);

//daily logs route 
app.route("/operator/daily-log", dailyLogRoutes);

// resident routes
app.route("/resident", residentRoutes);


export default {
  port: 4000,
  fetch: app.fetch,
};


