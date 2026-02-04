import { Context } from "hono";
import prisma from "../db";

/**
 * GET ALL PUMPS
 * Fetches pumps belonging specifically to the logged-in Admin's village.
 */
export const getPumps = async (c: Context) => {
  try {
    const payload = c.get("jwtPayload");
    
    // Safety check for Admin ID in token
    const adminId = payload?.id || payload?.admin_id;

    if (!adminId) {
      return c.json({ error: "Invalid Token: Missing Admin ID" }, 401);
    }

    // Identify Admin's Village
    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(adminId) },
      select: { village_id: true }
    });

    if (!admin?.village_id) {
      return c.json({ error: "Unauthorized: Admin not assigned to any village" }, 403);
    }

    // Fetch Pumps
    const pumps = await prisma.pump.findMany({
      where: { village_id: admin.village_id },
      include: { village: { select: { village_name: true } } },
      orderBy: { pump_id: 'desc' }
    });

    return c.json(pumps);
  } catch (error) {
    console.error("Get Pumps Error:", error);
    return c.json({ error: "Failed to fetch pumps" }, 500);
  }
};

/**
 * CREATE PUMP
 * Automatically assigns the pump to the Admin's village.
 */
export const createPump = async (c: Context) => {
  try {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");
    
    // Safety check for Admin ID
    const adminId = payload?.id || payload?.admin_id;

    if (!adminId) {
      return c.json({ error: "Invalid Token" }, 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(adminId) },
      select: { village_id: true }
    });

    if (!admin?.village_id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Create Pump with Auto-Village Assignment
    const newPump = await prisma.pump.create({
      data: {
        pump_name: body.pump_name,
        model_number: body.model_number || "N/A",
        qr_code: body.qr_code || `P-${Date.now()}`,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        flow_rate_lph: Number(body.flow_rate_lph),
        is_smart_pump: body.is_smart_pump,
        status: "ACTIVE",
        village_id: admin.village_id // Auto-assigned from Admin
      }
    });

    return c.json(newPump, 201);
  } catch (error) {
    console.error("Create Pump Error:", error);
    return c.json({ error: "Failed to create pump" }, 500);
  }
};

/**
 * UPDATE PUMP
 * Updates specific pump details.
 */
export const updatePump = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    const updated = await prisma.pump.update({
      where: { pump_id: id },
      data: {
        pump_name: body.pump_name,
        model_number: body.model_number,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        flow_rate_lph: Number(body.flow_rate_lph),
        is_smart_pump: body.is_smart_pump,
      }
    });

    return c.json(updated);
  } catch (error) {
    console.error("Update Pump Error:", error);
    return c.json({ error: "Update failed" }, 500);
  }
};

/**
 * DELETE PUMP
 */
export const deletePump = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    await prisma.pump.delete({ where: { pump_id: id } });
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete Pump Error:", error);
    return c.json({ error: "Delete failed" }, 500);
  }
};