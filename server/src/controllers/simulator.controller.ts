import { Context } from "hono";
import prisma from "../db";

// 1. GET Assets
export const getSimulationAssets = async (c: Context) => {
  try {
    const assets = await prisma.village.findMany({
      include: {
        pumps: true 
      }
    });
    return c.json(assets);
  } catch (error) {
    return c.json({ error: "Failed to load assets" }, 500);
  }
};

// 2. POST Generate (Smart Physics Engine)
export const generateSimulationData = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { pump_id, days } = body;

    if (!pump_id || !days) return c.json({ error: "Missing pump_id or days" }, 400);

    const pumpIdInt = Number(pump_id);
    const daysInt = Number(days);

    console.log(`🚀 Starting IoT Simulation for Pump ${pumpIdInt} over ${daysInt} days...`);

    // A. FIND REQUIRED RELATIONS (Operator & Tank)
    // Find ANY operator to attach these logs to (Required by DB)
    const anyOperator = await prisma.operator.findFirst({
        where: { 
            village: { pumps: { some: { pump_id: pumpIdInt } } } 
        }
    });
    const validOperator = anyOperator || await prisma.operator.findFirst();

    if (!validOperator) {
        return c.json({ error: "No Operators found in DB. Please create 1 Operator first." }, 400);
    }
    const operatorId = validOperator.operator_id;

    // Find Tank
    const pump = await prisma.pump.findUnique({
      where: { pump_id: pumpIdInt },
      include: { village: { include: { tanks: true } } }
    });

    if (!pump) return c.json({ error: "Pump not found" }, 404);
    const tankId = pump.village?.tanks.length > 0 ? pump.village.tanks[0].tank_id : null;

    // B. CLEANUP: Delete old logs
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysInt);

    await prisma.$transaction([
      prisma.dailyLog.deleteMany({
        where: { pump_id: pumpIdInt, created_at: { gte: startDate } }
      }),
      prisma.sensorLog.deleteMany({
        where: { pump_id: pumpIdInt, timestamp: { gte: startDate } }
      })
    ]);

    // C. SIMULATION LOOP
    const sensorLogsBuffer = [];
    const dailyLogsBuffer = [];
    let currentWaterLevel = 50; 

    for (let d = daysInt; d >= 0; d--) {
      const dateBase = new Date();
      dateBase.setDate(dateBase.getDate() - d);
      
      // --- NEW: DYNAMIC VARIANCE LOGIC ---
      // 1. Weekends have higher usage (people are home)
      const dayOfWeek = dateBase.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // 2. Base Load varies by day
      const baseLoad = isWeekend ? 55000 : 35000;
      
      // 3. Random "Chaos" Factor (Weather, leaks, festivals)
      // +/- 15,000 Liters variance
      const dailyChaos = Math.floor(Math.random() * 30000) - 15000;
      
      // Target for this day
      const targetDailyUsage = Math.max(10000, baseLoad + dailyChaos);
      
      let accumulatedUsage = 0; 

      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(dateBase);
        timestamp.setHours(hour, 0, 0, 0);

        const isMorningPeak = hour >= 6 && hour <= 9;
        const isEveningPeak = hour >= 18 && hour <= 20;
        const isNight = hour >= 23 || hour <= 4;

        // Distribute the 'Target Usage' across peak hours
        let flowRate = 0;
        if (isMorningPeak || isEveningPeak) {
          // Peaks get most of the water
          flowRate = (targetDailyUsage / 6) + (Math.random() * 500); 
        } else if (isNight) {
          flowRate = 0; 
        } else {
          // Random daytime usage
          if (Math.random() > 0.6) flowRate = 1500; 
        }

        // Physics: Water Level
        let drainRate = isMorningPeak || isEveningPeak ? 5.0 : 1.0;
        if (isNight) drainRate = 0.1;
        let fillRate = flowRate > 0 ? 6.0 : 0;
        
        currentWaterLevel = currentWaterLevel - drainRate + fillRate;
        if (currentWaterLevel > 100) currentWaterLevel = 100;
        if (currentWaterLevel < 0) currentWaterLevel = 0;
        
        const levelReading = parseFloat((currentWaterLevel + (Math.random() - 0.5)).toFixed(2));

        sensorLogsBuffer.push({
          timestamp: timestamp,
          reading_type: 'FLOW_RATE',
          value: Math.round(flowRate),
          unit: 'LPH',
          pump_id: pumpIdInt,
          tank_id: null
        });

        if (tankId) {
          sensorLogsBuffer.push({
            timestamp: timestamp,
            reading_type: 'WATER_LEVEL',
            value: levelReading,
            unit: '%',
            pump_id: null,
            tank_id: tankId
          });
        }
        accumulatedUsage += flowRate;
      }

      // Add to Daily Log (The Source of Truth for AI)
      dailyLogsBuffer.push({
        pump_id: pumpIdInt,
        usage_liters: Math.round(accumulatedUsage),
        created_at: dateBase,
        operator_id: operatorId, 
        start_time: dateBase,
        end_time: new Date(dateBase.getTime() + (8 * 60 * 60 * 1000)),
        gps_lat: 0.0,
        gps_lng: 0.0
      });
    }

    // D. BULK INSERT
    await prisma.$transaction([
      prisma.sensorLog.createMany({ data: sensorLogsBuffer }),
      prisma.dailyLog.createMany({ data: dailyLogsBuffer })
    ]);

    return c.json({ 
      success: true, 
      message: `Generated dynamic history for Pump ${pumpIdInt}.` 
    });

  } catch (error) {
    console.error("Simulation Error:", error);
    return c.json({ error: String(error) }, 500);
  }
};