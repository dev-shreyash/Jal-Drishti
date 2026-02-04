import { Hono } from "hono";
import prisma from "../db";
import { auth } from "../middleware/auth";

const operatorRoutes = new Hono();

/* ===============================
   CREATE DAILY LOG
================================ */
operatorRoutes.post("/daily-logs", auth("operator"), async (c) => {
  const body = await c.req.json();
  const user = c.get("user");

  const log = await prisma.dailyLog.create({
    data: {
      pump_id: Number(body.pump_id),
      operator_id: user.id,
      start_time: new Date(body.start_time),
      end_time: new Date(body.end_time),
      usage_liters: Number(body.usage_liters),
      chlorine_added: Boolean(body.chlorine_added),
      chlorine_ppm: body.chlorine_ppm ? Number(body.chlorine_ppm) : null,
      gps_lat: Number(body.gps_lat ?? 0),
      gps_lng: Number(body.gps_lng ?? 0),
    },
  });

  return c.json(log, 201);
});

/* ===============================
   GET MY DAILY LOGS
================================ */
operatorRoutes.get("/daily-logs", auth("operator"), async (c) => {
  const user = c.get("user");

  const logs = await prisma.dailyLog.findMany({
    where: { operator_id: user.id },
    orderBy: { created_at: "desc" },
  });

  return c.json(logs);
});

export default operatorRoutes;
