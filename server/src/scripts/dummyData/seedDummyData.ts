// server/scripts/seedDummyData.ts
import prisma from '../../db/db' 
async function main() {
  console.log('🏗️ INITIALIZING CITY-SCALE INFRASTRUCTURE SEEDING...')

  // ==============================================
  // 1. CITY CONFIGURATION
  // ==============================================
  const cities = [
    {
      name: 'Dadar',
      taluka: 'Mumbai City',
      district: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400028',
      coords: { lat: 19.0178, lng: 72.8478 }, 
      population: 200000, // 2 Lakhs
      tanks: 12,          
      pumps: 25,          
      zones: ['West', 'East', 'Shivaji Park', 'TT Circle'],
      adminUser: 'admin_dadar',
      operatorUser: 'op_dadar'
    },
    {
      name: 'Thane',
      taluka: 'Thane',
      district: 'Thane',
      state: 'Maharashtra',
      pincode: '400601',
      coords: { lat: 19.2183, lng: 72.9781 }, 
      population: 1800000, // 18 Lakhs
      tanks: 30,           
      pumps: 50,           
      zones: ['Ghodbunder', 'Naupada', 'Kopri', 'Vartak Nagar', 'Majiwada'],
      adminUser: 'admin_thane',
      operatorUser: 'op_thane'
    },
    {
      name: 'Dombivli',
      taluka: 'Kalyan',
      district: 'Thane',
      state: 'Maharashtra',
      pincode: '421202',
      coords: { lat: 19.2184, lng: 73.0867 }, 
      population: 1200000, // 12 Lakhs
      tanks: 18,
      pumps: 35,
      zones: ['MIDC', 'East', 'West', 'Manpada'],
      adminUser: 'admin_dombivli',
      operatorUser: 'op_dombivli'
    }
  ]

  // ==============================================
  // 2. GENERATION LOOP
  // ==============================================
  for (const city of cities) {
    console.log(`\n📍 Developing Infrastructure for: ${city.name.toUpperCase()} (${city.population.toLocaleString()} Residents)...`)

    // A. Create City Entry
    const village = await prisma.village.create({
      data: {
        village_name: city.name,
        taluka: city.taluka,
        district: city.district,
        state: city.state,
        pincode: city.pincode,
        population: city.population
      }
    })

    // B. Create Staff
    await prisma.admin.create({
      data: {
        name: `${city.name} Municipal Commissioner`,
        username: city.adminUser,
        password_hash: '123456', 
        contact_number: '9988776655',
        village_id: village.village_id
      }
    })

    // Create 3 Operators per city to distribute the load
    for(let k=1; k<=3; k++) {
      await prisma.operator.create({
        data: {
          name: `${city.name} Field Engineer ${k}`,
          username: `${city.operatorUser}_${k}`,
          phone: `987654321${k}`,
          password_hash: '123456',
          village_id: village.village_id
        }
      })
    }

    // C. Create Massive Water Tanks (ESR/GSR)
    console.log(`   - Constructing ${city.tanks} Water Tanks...`)
    for (let i = 1; i <= city.tanks; i++) {
      const zone = city.zones[i % city.zones.length] // Distribute across zones
      
      await prisma.tank.create({
        data: {
          tank_name: `${city.name} ${zone} ESR-${i}`, // ESR = Elevated Storage Reservoir
          capacity_liters: 50000 + (Math.floor(Math.random() * 450000)), // 50k to 5 Lakh Liters
          material_type: 'RCC Concrete',
          // Scatter coordinates wider (0.04 degrees is ~4km)
          latitude: city.coords.lat + (Math.random() - 0.5) * 0.04,
          longitude: city.coords.lng + (Math.random() - 0.5) * 0.04,
          is_smart_tank: Math.random() > 0.3, // 70% are smart
          village_id: village.village_id
        }
      })
    }

    // D. Create Pumping Stations
    console.log(`   - Installing ${city.pumps} Pumping Stations...`)
    for (let i = 1; i <= city.pumps; i++) {
      const zone = city.zones[i % city.zones.length]
      
      await prisma.pump.create({
        data: {
          pump_name: `${city.name} ${zone} Pump Stn ${i}`,
          model_number: `KIRLOSKAR-IND-${Math.floor(Math.random() * 9000)}`,
          qr_code: `${city.name.substring(0,3).toUpperCase()}-${zone.substring(0,1)}-${i}`,
          // Scatter coordinates wider
          latitude: city.coords.lat + (Math.random() - 0.5) * 0.05,
          longitude: city.coords.lng + (Math.random() - 0.5) * 0.05,
          flow_rate_lph: 5000 + (Math.floor(Math.random() * 10000)), // 5k - 15k LPH (High Capacity)
          is_smart_pump: Math.random() > 0.2, // 80% are smart
          village_id: village.village_id
        }
      })
    }
  }

  console.log('\n✅ INFRASTRUCTURE DEPLOYMENT COMPLETE!')
  console.log('================================================')
  console.log('   Dadar:     admin_dadar    (25 Pumps, 12 Tanks)')
  console.log('   Thane:     admin_thane    (50 Pumps, 30 Tanks)')
  console.log('   Dombivli:  admin_dombivli (35 Pumps, 18 Tanks)')
  console.log('================================================')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })