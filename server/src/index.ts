import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth.route";
import operatorRoutes from "./routes/operator.route";

const app = new Hono();

app.use("*", cors());

app.get("/ping", (c) => c.text("pong"));

app.route("/auth", authRoutes);
app.route("/operator", operatorRoutes);

export default app;
