import prisma from "../db";
import { Context } from "hono";

export const createDailyLog = async (c: Context) => {
  const body = await c.req.json();
  const user = c.get("user"); // from auth middleware

  const log = await prisma.dailyLog.create({
    data: {
      pump_id: Number(body.pump_id),
      operator_id: user.id,
      start_time: new Date(body.start_time),
      end_time: new Date(body.end_time),
      usage_liters: Number(body.usage_liters),
      chlorine_added: Boolean(body.chlorine_added),
      chlorine_ppm: body.chlorine_ppm
        ? Number(body.chlorine_ppm)
        : null,
      gps_lat: Number(body.gps_lat),
      gps_lng: Number(body.gps_lng),
    },
  });

  return c.json(log, 201);
};

export const getMyDailyLogs = async (c: Context) => {
  const user = c.get("user");

  const logs = await prisma.dailyLog.findMany({
    where: { operator_id: user.id },
    orderBy: { created_at: "desc" },
    include: { pump: true },
  });

  return c.json(logs);
};
