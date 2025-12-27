import { Hono } from "hono";
import authRoutes from "./routes/auth.route";

const app = new Hono();

app.route("/auth", authRoutes);

export default app;
