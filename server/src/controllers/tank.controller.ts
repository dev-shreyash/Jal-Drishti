import { Context } from "hono";
import prisma from "../db";

/**
 * GET ALL TANKS
 * Fetches tanks belonging specifically to the logged-in Admin's village.
 */
export const getTanks = async (c: Context) => {
  try {
    const payload = c.get("jwtPayload");
    const adminId = payload?.id || payload?.admin_id;

    if (!adminId) {
      return c.json({ error: "Invalid Token: Missing Admin ID" }, 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(adminId) },
      select: { village_id: true }
    });

    if (!admin?.village_id) {
      return c.json({ error: "Unauthorized: Admin not assigned to any village" }, 403);
    }

    const tanks = await prisma.tank.findMany({
      where: { village_id: admin.village_id },
      include: { village: { select: { village_name: true } } },
      orderBy: { tank_id: 'desc' }
    });

    return c.json(tanks);
  } catch (error) {
    console.error("Get Tanks Error:", error);
    return c.json({ error: "Failed to fetch tanks" }, 500);
  }
};

/**
 * CREATE TANK
 * Automatically assigns the tank to the Admin's village.
 */
export const createTank = async (c: Context) => {
  try {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");
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

    const newTank = await prisma.tank.create({
      data: {
        tank_name: body.tank_name,
        capacity_liters: Number(body.capacity_liters),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        village_id: admin.village_id, // Auto-assigned from Admin
      }
    });

    return c.json(newTank, 201);
  } catch (error) {
    console.error("Create Tank Error:", error);
    return c.json({ error: "Failed to create tank" }, 500);
  }
};

/**
 * UPDATE TANK
 */
export const updateTank = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    const updated = await prisma.tank.update({
      where: { tank_id: id },
      data: {
        tank_name: body.tank_name,
        capacity_liters: Number(body.capacity_liters),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
      }
    });

    return c.json(updated);
  } catch (error) {
    console.error("Update Tank Error:", error);
    return c.json({ error: "Update failed" }, 500);
  }
};

/**
 * DELETE TANK
 * This is the export your route file was missing!
 */
export const deleteTank = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    
    await prisma.tank.delete({
      where: { tank_id: id }
    });

    return c.json({ success: true, message: "Tank deleted successfully" });
  } catch (error) {
    console.error("Delete Tank Error:", error);
    return c.json({ error: "Delete failed" }, 500);
  }
};