import { Hono } from "hono";

const operatorRoutes = new Hono();


const { operatorLogin } = await import("../controllers/Auth/operator.auth.controller");
const { operatorAuthMiddleware} = await import("../middleware/operator.auth.middleware")



const authRoutes = new Hono();

// --- PUBLIC ROUTES (No Auth Required) ---
authRoutes.post("/operator/login", operatorLogin );


export default operatorRoutes;
