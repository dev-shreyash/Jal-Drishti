import { Hono } from "hono";
import { getVillageOptions } from "../controllers/village.controller";

const villageRouter = new Hono();

villageRouter.get("/options", getVillageOptions);

export default villageRouter;