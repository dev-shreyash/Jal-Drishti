import { Hono } from "hono";
import { operatorLogin } from "../controllers/operatorAuth.controller";

const operatorAuth = new Hono();

operatorAuth.post("/login", operatorLogin);

export default operatorAuth;
