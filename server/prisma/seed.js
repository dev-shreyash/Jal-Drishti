// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create a sample village
  const village = await prisma.village.create({
    data: {
      village_name: 'Sample Village',
      taluka: 'Sample Taluka',
      district: 'Sample District',
      state: 'Maharashtra',
      pincode: '441001',
      population: 5000
    }
  });

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      name: 'System Admin',
      username: 'admin',
      password_hash: adminPassword,
      email: 'admin@jaldrishti.com',
      contact_number: '9876543210',
      village_id: village.village_id
    }
  });

  // Create operator
  const operatorPassword = await bcrypt.hash('operator123', 10);
  const operator = await prisma.operator.create({
    data: {
      name: 'Field Operator',
      phone: '9876543211',
      username: 'operator',
      password_hash: operatorPassword,
      village_id: village.village_id
    }
  });

  // Create sample pumps
  const pump1 = await prisma.pump.create({
    data: {
      pump_name: 'Main Village Pump',
      model_number: 'PMP-100',
      qr_code: 'PUMP-001',
      latitude: 19.0760,
      longitude: 72.8777,
      flow_rate_lph: 5000,
      is_smart_pump: false,
      village_id: village.village_id
    }
  });

  const pump2 = await prisma.pump.create({
    data: {
      pump_name: 'Smart Water Pump',
      model_number: 'SWP-200',
      qr_code: 'PUMP-002',
      latitude: 19.0765,
      longitude: 72.8782,
      flow_rate_lph: 8000,
      is_smart_pump: true,
      village_id: village.village_id
    }
  });

  // Create sample tank
  const tank = await prisma.tank.create({
    data: {
      tank_name: 'Main Storage Tank',
      capacity_liters: 100000,
      material_type: 'Concrete',
      is_smart_tank: true,
      village_id: village.village_id
    }
  });

  console.log('Database seeded successfully!');
  console.log(`Village ID: ${village.village_id}`);
  console.log(`Admin username: admin, password: admin123`);
  console.log(`Operator username: operator, password: operator123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });