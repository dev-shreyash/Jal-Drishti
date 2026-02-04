import { Context } from "hono";
import prisma from "../db";
import { WaterForecaster } from "../ai/prediction";

export const getDashboardStats = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const villageId = user?.village_id;

    if (!villageId) {
      return c.json({ message: "Village ID not found in token" }, 400);
    }

    // 2. Fetch Village Details
    const village = await prisma.village.findUnique({
      where: { village_id: Number(villageId) },
      select: { village_name: true, population: true }
    });

    // 3. Run Counts in Parallel
    const [pumpCount, operatorCount, complaintCount] = await Promise.all([
      // Count Pumps
      prisma.pump.count({ where: { village_id: Number(villageId) } }),
      
      // Count Operators
      prisma.operator.count({ where: { village_id: Number(villageId) } }),
      
      // Count Complaints (via Resident relation)
      prisma.complaint.count({ 
        where: { 
          resident: {
            village_id: Number(villageId)
          },
          status: "PENDING" 
        } 
      })
    ]);

    // 4. Return Structure
    return c.json({
      villageName: village?.village_name || "Unknown Village",
      population: village?.population || 0,
      pumps: pumpCount,
      operators: operatorCount,
      complaints: complaintCount,
      alerts: 0 // Set to 0 for now since 'status' column doesn't exist on Pump table
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return c.json({ message: "Failed to fetch stats" }, 500);
  }
};

export const dailyUsageSummary = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const villageId = user?.village_id;

    if (!villageId) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const villagePumps = await prisma.pump.findMany({
      where: { village_id: Number(villageId) },
      select: { pump_id: true }
    });

    const pumpIds = villagePumps.map(p => p.pump_id);

    const data = await prisma.dailyLog.groupBy({
      by: ["pump_id"],
      where: {
        created_at: {
          gte: today,
        },
        pump_id: {
          in: pumpIds 
        }
      },
      _sum: {
        usage_liters: true,
      },
    });

    const totalUsage = data.reduce(
      (sum, d) => sum + (d._sum.usage_liters || 0),
      0
    );

    return c.json({
      success: true,
      date: today.toISOString().split("T")[0],
      total_pumps_used: data.length,
      total_usage_liters: totalUsage,
    });

  } catch (error) {
    console.error("Dashboard Usage Error:", error);
    return c.json(
      { success: false, message: "Failed to load dashboard data" },
      500
    );
  }
};


export const getAiPredictions = async (c: Context) => {
  try {
    const user = c.get("jwtPayload");
    const villageId = user?.village_id;

    if (!villageId) return c.json({ message: "Unauthorized" }, 401);

    // 1. Fetch RAW Historical Logs (Last 90 Days)
    // We fetch raw rows to handle date merging safely in JS
    const rawLogs = await prisma.dailyLog.findMany({
      where: {
        pump: { village_id: Number(villageId) }, 
        created_at: {
          gte: new Date(new Date().setDate(new Date().getDate() - 90)) // <-- 90 Days History
        }
      },
      select: {
        created_at: true,
        usage_liters: true
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    // 2. JavaScript Aggregation (The "Clean Up" Step)
    // Merge multiple pumps/entries into a single "Total Village Usage" per day
    const dailyMap = new Map<string, number>();

    rawLogs.forEach(log => {
      // Convert timestamp to simple "YYYY-MM-DD" string key
      const dateKey = new Date(log.created_at).toISOString().split('T')[0];
      
      const currentTotal = dailyMap.get(dateKey) || 0;
      dailyMap.set(dateKey, currentTotal + log.usage_liters);
    });

    // Convert Map back to Array for the AI
    const formattedHistory = Array.from(dailyMap.entries()).map(([dateStr, usage]) => ({
      date: new Date(dateStr),
      usage: usage
    })).sort((a, b) => a.date.getTime() - b.date.getTime()); // Ensure sorted by date

    // 3. Run Prediction
    const forecaster = new WaterForecaster();
    
    // Check if we have enough data
    if (formattedHistory.length < 5) {
      return c.json({ 
        success: false, 
        message: "Not enough data for AI. Please use the simulator to generate logs.",
        predictions: [] 
      });
    }

    // Predict next 7 days
    const predictions = forecaster.predict(formattedHistory, 7); 

    return c.json({
      success: true,
      dataPointsAnalyzed: formattedHistory.length, // Debug info for you
      predictions: predictions
    });

  } catch (error) {
    console.error("Prediction Error:", error);
    return c.json({ message: "Prediction Engine Failed", error: String(error) }, 500);
  }
};