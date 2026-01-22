import { Context } from 'hono'
import prisma from '../db/db'
import { WaterForecaster } from '../ai/prediction'

const forecaster = new WaterForecaster()

/**
 *  HELPER: Merge Manual Logs + Sensor Logs into Daily Totals
 */
const aggregateAllSources = (manualLogs: any[], sensorLogs: any[]) => {
  const dailyMap = new Map<string, number>()

  // 1. Process Manual Logs
  manualLogs.forEach(log => {
    const dateKey = new Date(log.start_time).toISOString().split('T')[0]
    const currentTotal = dailyMap.get(dateKey) || 0
    dailyMap.set(dateKey, currentTotal + log.usage_liters)
  })

  // 2. Process Sensor Logs (IoT Data)
  // Assuming sensor value is "Flow Rate" (L/min) or "Total Volume" (Liters)
  // For this logic, we assume 'value' is volume for that timestamp.
  sensorLogs.forEach(log => {
    const dateKey = new Date(log.timestamp).toISOString().split('T')[0]
    const currentTotal = dailyMap.get(dateKey) || 0
    // If sensor logs are cumulative, logic differs. Here we assume discrete usage chunks.
    dailyMap.set(dateKey, currentTotal + log.value) 
  })

  // 3. Convert to Array & Sort
  return Array.from(dailyMap.entries())
    .map(([date, usage]) => ({ date: new Date(date), usage }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

// ==========================================
// 1. TRAIN MODEL (Unified Data)
// ==========================================
export const trainModel = async (c: Context) => {
  try {
    const villageId = Number(c.req.param('village_id'))
    console.log(`Training Request for Village ID: ${villageId} (Sources: Manual + Sensors)`)

    // A. Fetch Manual Logs
    const manualLogs = await prisma.dailyLog.findMany({
      where: { pump: { village_id: villageId } },
      select: { start_time: true, usage_liters: true }
    })

    // B. Fetch Sensor Logs (Flow Sensors)
    const sensorLogs = await prisma.sensorLog.findMany({
      where: { 
        pump: { village_id: villageId }, // Linked via Pump
        reading_type: 'FLOW_RATE'        // Only get flow data, not pH/Quality
      },
      select: { timestamp: true, value: true }
    })

    // C. Merge Them
    const trainingData = aggregateAllSources(manualLogs, sensorLogs)
    
    console.log(`Merged Data: ${manualLogs.length} Manual + ${sensorLogs.length} Sensor Logs -> ${trainingData.length} Unique Days`)

    if (trainingData.length < 14) {
      return c.json({ 
        error: `Not enough combined data. Found ${trainingData.length} days, need 14+.`,
        details: "Ensure you have Manual Logs OR Sensor Data generated."
      }, 400)
    }

    // D. Train AI
    const artifacts = forecaster.train(trainingData)

    // E. Save to DB
    const existingModel = await prisma.aiModel.findFirst({ where: { village_id: villageId } })
    
    if (existingModel) {
      await prisma.aiModel.update({
        where: { model_id: existingModel.model_id },
        data: { model_weights: artifacts as any, trained_at: new Date() }
      })
    } else {
      await prisma.aiModel.create({
        data: {
          village_id: villageId,
          algorithm: "ARIMA-Hybrid-Source", // Updated Algo Name
          model_weights: artifacts as any
        }
      })
    }

    return c.json({ success: true, message: "Hybrid AI Model Trained", stats: artifacts })

  } catch (error: any) {
    console.error("Training Error:", error)
    return c.json({ error: "Training Failed: " + error.message }, 500)
  }
}

// ==========================================
// 2. GET FORECAST
// ==========================================
export const getForecast = async (c: Context) => {
  try {
    const villageId = Number(c.req.query('village_id'))
    if (!villageId) return c.json({ error: "Village ID required" }, 400)

    // A. Check Model
    const aiModel = await prisma.aiModel.findFirst({
      where: { village_id: villageId },
      orderBy: { trained_at: 'desc' }
    })
    
    if (!aiModel) return c.json({ error: "Model not trained yet." }, 404)

    // B. Fetch Recent History (Both Sources)
    const manualLogs = await prisma.dailyLog.findMany({
      where: { pump: { village_id: villageId } },
      select: { start_time: true, usage_liters: true },
      orderBy: { start_time: 'desc' },
      take: 100 
    })

    const sensorLogs = await prisma.sensorLog.findMany({
      where: { 
        pump: { village_id: villageId },
        reading_type: 'FLOW_RATE'
      },
      select: { timestamp: true, value: true },
      orderBy: { timestamp: 'desc' },
      take: 100
    })

    // C. Aggregation
    const historyData = aggregateAllSources(manualLogs, sensorLogs)

    // D. Predict
    const forecast = forecaster.predict(historyData, 7)

    return c.json({
      village_id: villageId,
      algorithm: aiModel.algorithm,
      forecast: forecast
    })

  } catch (error) {
    return c.json({ error: "Prediction Failed" }, 500)
  }
}