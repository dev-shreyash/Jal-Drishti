import prisma from '../../db/db' 

async function main() {
  console.log(' INITIALIZING SMART RURAL INFRASTRUCTURE (Population-Based Scaling)...')

  // ==============================================
  // 1. VILLAGE CONFIGURATION (Real Geography)
  // ==============================================
  const villagesData = [
    {
      name: 'Adarsh Gaon',   
      population: 4500,     // Demand: ~247,500 Liters/Day
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '412205',
      tanks: 2,              
      pumps: 5,              
      coords: { lat: 18.5204, lng: 73.8567 }, // Near Pune
      zones: ['Main Chowk', 'School Area', 'Farm East', 'Gaothan'],
      adminUser: 'sarpanch_adarsh',
      operatorUser: 'operator_adarsh'
    },
    {
      name: 'Sonapur',       
      population: 2800,     // Demand: ~154,000 Liters/Day
      taluka: 'Shahapur',
      district: 'Thane',
      state: 'Maharashtra',
      pincode: '421601',
      tanks: 1,
      pumps: 3,
      coords: { lat: 19.45, lng: 73.33 }, // Rural Thane
      zones: ['Temple Road', 'Market', 'River Side'],
      adminUser: 'sarpanch_sonapur',
      operatorUser: 'operator_sonapur'
    },
    {
      name: 'Wadgaon',       
      population: 6200,     // Demand: ~341,000 Liters/Day
      taluka: 'Murbad',
      district: 'Thane',
      state: 'Maharashtra',
      pincode: '421401',
      tanks: 3,
      pumps: 6,
      coords: { lat: 19.25, lng: 73.40 }, // Murbad Region
      zones: ['Bus Stand', 'Old Well', 'Patil Wadi', 'New Colony'],
      adminUser: 'sarpanch_wadgaon',
      operatorUser: 'operator_wadgaon'
    }
  ]

  // ==============================================
  // 2. GENERATION LOOP
  // ==============================================
  for (const v of villagesData) {
    // --- STEP 1: CALCULATE JJM DEMAND ---
    const TOTAL_DAILY_DEMAND = v.population * 55; // 55 LPCD Standard
    
    // Each pump runs ~10 hours. Flow needed = Demand / (Pumps * 10)
    const TARGET_FLOW_PER_PUMP = Math.round(TOTAL_DAILY_DEMAND / (v.pumps * 10));
    
    // Tanks should hold ~1 day of storage
    const TARGET_TANK_CAPACITY = Math.round(TOTAL_DAILY_DEMAND / v.tanks);

    console.log(`\n ${v.name.toUpperCase()}, Tal: ${v.taluka}, Dist: ${v.district}`)
    console.log(`    Population: ${v.population.toLocaleString()}`)
    console.log(`    Daily Water Need: ${TOTAL_DAILY_DEMAND.toLocaleString()} Liters`)
    console.log(`     Target Flow Rate: ~${TARGET_FLOW_PER_PUMP.toLocaleString()} LPH per pump`)

    // --- STEP 2: CREATE DATABASE ENTRIES ---
    
    // A. Create Village (Using REAL Data from config)
    const village = await prisma.village.create({
      data: {
        village_name: v.name,
        taluka: v.taluka,       
        district: v.district,  
        state: v.state,         
        pincode: v.pincode,     
        population: v.population
      }
    })

    // B. Create Sarpanch (Admin)
    await prisma.admin.create({
      data: {
        name: `${v.name} Sarpanch`,
        username: v.adminUser,
        password_hash: '123456', 
        contact_number: '9988776655',
        village_id: village.village_id
      }
    })

    // C. Create Operators (Jal Surakshaks)
    for(let k=1; k<=2; k++) {
      await prisma.operator.create({
        data: {
          name: `${v.name} Jal Surakshak ${k}`,
          username: `${v.operatorUser}_${k}`,
          phone: `987654321${k}`,
          password_hash: '123456',
          village_id: village.village_id
        }
      })
    }

    // D. Create Tanks (Scaled to Population)
    console.log(`   - Building ${v.tanks} Tanks (Capacity: ~${TARGET_TANK_CAPACITY.toLocaleString()} L)...`)
    for (let i = 1; i <= v.tanks; i++) {
      const zone = v.zones[i % v.zones.length]
      
      // Add ±10% variation for realism
      const variation = 0.9 + (Math.random() * 0.2); 
      const actualCapacity = Math.round(TARGET_TANK_CAPACITY * variation);

      await prisma.tank.create({
        data: {
          tank_name: `${v.name} ${zone} Tank ${i}`, 
          capacity_liters: actualCapacity, 
          material_type: 'RCC',
          // Coordinates randomized slightly around village center
          latitude: v.coords.lat + (Math.random() - 0.5) * 0.01,
          longitude: v.coords.lng + (Math.random() - 0.5) * 0.01,
          is_smart_tank: true,
          village_id: village.village_id
        }
      })
    }

    // E. Create Pumps (Scaled to Population)
    console.log(`   - Installing ${v.pumps} Pumps (Flow: ~${TARGET_FLOW_PER_PUMP.toLocaleString()} LPH)...`)
    for (let i = 1; i <= v.pumps; i++) {
      const zone = v.zones[i % v.zones.length]

      // Add ±15% variation for realism
      const variation = 0.85 + (Math.random() * 0.3); 
      const actualFlowRate = Math.round(TARGET_FLOW_PER_PUMP * variation);
      
      await prisma.pump.create({
        data: {
          pump_name: `${v.name} ${zone} Pump ${i}`,
          model_number: `KIRLOSKAR-IND-${Math.floor(Math.random()*999)}`,
          qr_code: `P-${i}-${Date.now()}`,
          // Coordinates randomized slightly around village center
          latitude: v.coords.lat + (Math.random() - 0.5) * 0.015,
          longitude: v.coords.lng + (Math.random() - 0.5) * 0.015,
          
          //  DYNAMIC FLOW RATE (Calculated based on Population)
          flow_rate_lph: actualFlowRate, 
          
          is_smart_pump: true, 
          village_id: village.village_id
        }
      })
    }
  }
  console.log('\n INFRASTRUCTURE SCALED & DEPLOYED!')
  console.log('   (Data is now mathematically consistent with 55 LPCD norm)')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })