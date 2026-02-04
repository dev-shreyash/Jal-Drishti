import { Hono } from "hono";
import { generateSimulationData, getSimulationAssets } from "../controllers/simulator.controller";


const simulationRoutes = new Hono();

// GET http://localhost:3000/simulation/assets
simulationRoutes.get("/assets", getSimulationAssets);

// POST http://localhost:3000/simulation/generate
simulationRoutes.post("/generate", generateSimulationData);

export default simulationRoutes;