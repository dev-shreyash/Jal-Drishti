// server/src/controllers/simulationController.ts
import { Context } from 'hono'
import prisma from '../db/db'
import { generateVillageData } from '../scripts/simulateData' 

// 1. Get Assets for the Simulation Dropdown
export const getAssets = async (c: Context) => {
  try {
    const villages = await prisma.village.findMany({
      include: { pumps: true }
    })
    return c.json(villages)
  } catch (error) {
    return c.json({ error: 'Failed to fetch assets' }, 500)
  }
}

// 2. Trigger the Data Generation Script
export const runDataGeneration = async (c: Context) => {
  try {
    const { pump_id, days } = await c.req.json()
    
    // Call the logic from the script folder
    const result = await generateVillageData(Number(pump_id), days)

    return c.json({ 
      success: true, 
      message: `Generated ${result.logsCreated} logs for ${result.pump} in ${result.village}` 
    })

  } catch (error: any) {
    console.error(error)
    return c.json({ error: error.message || 'Generation failed' }, 500)
  }
}