import { Router } from "express";
import { getVillageOptions } from "../controllers/village.controller";

const router = Router();

// Route: GET http://localhost:5000/api/villages/options
router.get("/options", getVillageOptions);

export default router;