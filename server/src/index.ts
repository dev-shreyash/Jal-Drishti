import { Hono } from "hono";
import authRoutes from "./routes/auth.route";
import * as simulationController from './controllers/simulation.controller'
import * as aiController from './controllers/ai.controller'
import { cors } from 'hono/cors'
const app = new Hono();

app.route("/auth", authRoutes);

app.use('/*', cors())

// ==========================================
// SIMULATION & DATA GENERATOR ROUTES
// ==========================================
app.get('/api/simulation/assets', simulationController.getAssets)
app.post('/api/simulation/generate', simulationController.runDataGeneration)
// AI & FORECASTING ROUTES
app.post('/api/ai/train/:village_id', aiController.trainModel) // <-- Changed
app.get('/api/ai/forecast', aiController.getForecast)

export default app;

