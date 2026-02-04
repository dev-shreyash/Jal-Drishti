import { Context } from "hono";
import { prisma } from "../lib/prisma";

export const dailyUsageSummary = async (c: Context) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await prisma.dailyLog.groupBy({
      by: ["pump_id"],
      where: {
        created_at: {
          gte: today,
        },
      },
      _sum: {
        usage_liters: true,
      },
    });

    return c.json({
      success: true,
      date: today.toISOString().split("T")[0],
      total_pumps_used: data.length,
      total_usage_liters: data.reduce(
        (sum, d) => sum + (d._sum.usage_liters || 0),
        0
      ),
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return c.json(
      { success: false, message: "Failed to load dashboard data" },
      500
    );
  }
};
