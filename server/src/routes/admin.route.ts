import { Hono } from "hono";
import { Context } from "hono";
import prisma from "../db";


const adminRoutes = new Hono();

/* ---------------- STATS ---------------- */


/* ---------------- GET ALL VILLAGES ---------------- */
adminRoutes.get("/villages", async (c: Context) => {
  const villages = await prisma.village.findMany({
    orderBy: { village_id: "desc" },
  });
  return c.json(villages);
});

/* ---------------- ADD VILLAGE ---------------- */
adminRoutes.post("/villages", async (c: Context) => {
  const data = await c.req.json();

  const village = await prisma.village.create({
    data: {
      village_name: data.village_name,
      district: data.district,
      taluka: data.taluka,
      state: data.state,
      pincode: data.pincode,
      population: Number(data.population),
    },
  });

  return c.json(village);
});

/* ---------------- UPDATE VILLAGE ---------------- */
adminRoutes.put("/villages/:id", async (c: Context) => {
  const id = Number(c.req.param("id"));
  const data = await c.req.json();

  const village = await prisma.village.update({
    where: { village_id: id },
    data: {
      village_name: data.village_name,
      district: data.district,
      taluka: data.taluka,
      state: data.state,
      pincode: data.pincode,
      population: Number(data.population),
    },
  });

  return c.json(village);
});

/* ---------------- DELETE VILLAGE ---------------- */
adminRoutes.delete("/villages/:id", async (c: Context) => {
  const id = Number(c.req.param("id"));

  await prisma.village.delete({
    where: { village_id: id },
  });

  return c.json({ success: true });
});


// GET all pumps
adminRoutes.get("/pumps", async (c) => {
  const pumps = await prisma.pump.findMany({
    include: { village: true },
  });
  return c.json(pumps);
});

// CREATE pump
adminRoutes.post("/pumps", async (c) => {
  const data = await c.req.json();

  const pump = await prisma.pump.create({
    data: {
      pump_name: data.pump_name,
      model_number: data.model_number || null,
      installation_date: data.installation_date
        ? new Date(data.installation_date)
        : null,
      last_maintained: data.last_maintained
        ? new Date(data.last_maintained)
        : null,
      qr_code: data.qr_code,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      flow_rate_lph: Number(data.flow_rate_lph),
      is_smart_pump: Boolean(data.is_smart_pump),
      village_id: Number(data.village_id),
    },
  });

  return c.json(pump);
});

// UPDATE pump
adminRoutes.put("/pumps/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const data = await c.req.json();

  const pump = await prisma.pump.update({
    where: { pump_id: id },
    data: {
      pump_name: data.pump_name,
      model_number: data.model_number || null,
      installation_date: data.installation_date
        ? new Date(data.installation_date)
        : null,
      last_maintained: data.last_maintained
        ? new Date(data.last_maintained)
        : null,
      qr_code: data.qr_code,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      flow_rate_lph: Number(data.flow_rate_lph),
      is_smart_pump: Boolean(data.is_smart_pump),
      village_id: Number(data.village_id),
    },
  });

  return c.json(pump);
});

// DELETE pump
adminRoutes.delete("/pumps/:id", async (c) => {
  const id = Number(c.req.param("id"));

  await prisma.pump.delete({
    where: { pump_id: id },
  });

  return c.json({ success: true });
});

export default adminRoutes;
