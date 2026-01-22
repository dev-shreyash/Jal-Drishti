// server/scripts/dataGenerator.ts
import prisma from '../db/db'

export async function generateVillageData(pumpId: number, days: number = 90) {
  console.log(` Starting IoT Sensor Simulation for Pump ID: ${pumpId}...`)

  // 1. Fetch Pump and find a Tank in the same village
  const pump = await prisma.pump.findUnique({
    where: { pump_id: pumpId },
    include: { 
      village: {
        include: {
          tanks: true // We need a tank to simulate water levels
        }
      } 
    }
  })

  if (!pump) throw new Error(`❌ Pump ${pumpId} not found.`)
  
  // Use the first tank found, or null if none exists
  const tankId = pump.village.tanks.length > 0 ? pump.village.tanks[0].tank_id : null

  console.log(` Village: ${pump.village.village_name}`)
  console.log(` Target Pump: ${pump.pump_name}`)
  if(tankId) console.log(` Target Tank ID: ${tankId}`)

  let logsCreated = 0
  let currentWaterLevel = 50 // Start tank at 50%

  // 2. Loop through Days
  for (let d = days; d >= 0; d--) {
    const dateBase = new Date()
    dateBase.setDate(dateBase.getDate() - d)

    // 3. Loop through Hours (00:00 to 23:00) - Simulating Hourly Sensors
    for (let hour = 0; hour < 24; hour++) {
      
      const timestamp = new Date(dateBase)
      timestamp.setHours(hour, 0, 0, 0)

      // --- LOGIC: Define "Peak Hours" ---
      // Morning: 6AM - 9AM
      // Evening: 6PM - 8PM
      const isMorningPeak = hour >= 6 && hour <= 9
      const isEveningPeak = hour >= 18 && hour <= 20
      const isNight = hour >= 23 || hour <= 4

      // --- A. PUMP FLOW RATE (Liters Per Hour) ---
      // Pump runs mainly during peaks to fill the tank
      let flowRate = 0
      if (isMorningPeak || isEveningPeak) {
        flowRate = 2500 + (Math.random() * 200) // Pump ON (~2500 LPH)
      } else if (isNight) {
        flowRate = 0 // Pump OFF
      } else {
        // Random short bursts during the day
        if (Math.random() > 0.7) flowRate = 2000 
      }

      // --- B. TANK WATER LEVEL (%) ---
      // Water drains during peaks (people using it)
      // Water rises if Flow Rate is high (pump filling it)
      
      let drainRate = 1.0 // Normal usage
      if (isMorningPeak || isEveningPeak) drainRate = 5.0 // High usage
      if (isNight) drainRate = 0.1 // No usage

      let fillRate = flowRate > 0 ? 6.0 : 0 // Pump fills faster than drain

      currentWaterLevel = currentWaterLevel - drainRate + fillRate

      // Physics limits (0% to 100%)
      if (currentWaterLevel > 100) currentWaterLevel = 100
      if (currentWaterLevel < 0) currentWaterLevel = 0

      // Add noise (Sensors are never perfect)
      const levelReading = parseFloat((currentWaterLevel + (Math.random() - 0.5)).toFixed(2))
      
      // 4. WRITE TO DB (SensorLog Table)
      
      // Log 1: Pump Flow Rate
      await prisma.sensorLog.create({
        data: {
          timestamp: timestamp,
          reading_type: 'FLOW_RATE',
          value: flowRate,
          unit: 'LPH',
          pump_id: pumpId,
          tank_id: null
        }
      })

      // Log 2: Tank Level (Only if we found a tank)
      if (tankId) {
        await prisma.sensorLog.create({
          data: {
            timestamp: timestamp,
            reading_type: 'WATER_LEVEL',
            value: levelReading,
            unit: '%',
            pump_id: null,
            tank_id: tankId
          }
        })
      }

      logsCreated += (tankId ? 2 : 1)
    }
  }

  console.log(` Success! Generated ${logsCreated} sensor readings.`)

  return {
    success: true,
    logsCreated,
    village: pump.village.village_name,
    pump: pump.pump_name
  }
}