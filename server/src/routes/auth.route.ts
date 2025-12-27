import { Hono } from "hono";
import { login } from "../controllers/auth.contoller";

const authRoutes = new Hono();

authRoutes.post("/login", login);

export default authRoutes;
