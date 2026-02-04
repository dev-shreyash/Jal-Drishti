import { Context } from "hono";
import { prisma } from "../lib/prisma";


export const analyticsSummary = async (c: Context) => {
  const admin = c.get("admin");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayUsage = await prisma.dailyLog.aggregate({
    _sum: { usage_liters: true },
    where: {
      pump: { village_id: admin.village_id },
      created_at: { gte: todayStart }
    }
  });

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const weeklyUsage = await prisma.dailyLog.aggregate({
    _sum: { usage_liters: true },
    where: {
      pump: { village_id: admin.village_id },
      created_at: { gte: last7Days }
    }
  });

  const pumpCount = await prisma.pump.count({
    where: { village_id: admin.village_id }
  });

  return c.json({
    success: true,
    today_usage: todayUsage._sum.usage_liters ?? 0,
    last_7_days_usage: weeklyUsage._sum.usage_liters ?? 0,
    total_pumps: pumpCount
  });
};


export const pumpUsage = async (c: Context) => {
  const admin = c.get("admin");

  const data = await prisma.dailyLog.groupBy({
    by: ["pump_id"],
    _sum: { usage_liters: true },
    where: {
      pump: { village_id: admin.village_id }
    }
  });

  return c.json({ success: true, data });
};


export const dailyTrend = async (c: Context) => {
  const admin = c.get("admin");

  const logs = await prisma.$queryRawUnsafe<
    { date: string; total: number }[]
  >(`
    SELECT DATE(created_at) as date, SUM(usage_liters) as total
    FROM dailylog
    WHERE pump_id IN (
      SELECT pump_id FROM pump WHERE village_id = ?
    )
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `, admin.village_id);

  return c.json({ success: true, trend: logs });
};


export const shortageAlert = async (c: Context) => {
  const admin = c.get("admin");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayUsage = await prisma.dailyLog.aggregate({
    _sum: { usage_liters: true },
    where: {
      pump: { village_id: admin.village_id },
      created_at: { gte: today }
    }
  });

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const weekly = await prisma.dailyLog.aggregate({
    _sum: { usage_liters: true },
    where: {
      pump: { village_id: admin.village_id },
      created_at: { gte: last7Days }
    }
  });

  const avg = (weekly._sum.usage_liters ?? 0) / 7;
  const todayVal = todayUsage._sum.usage_liters ?? 0;

  return c.json({
    success: true,
    alert:
      todayVal < avg * 0.6
        ? "Possible water shortage"
        : "Water supply normal"
  });
};
