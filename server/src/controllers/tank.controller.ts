
import { Context } from "hono";
import { prisma } from "../lib/prisma";

export const addTank = async (c: Context) => {
  try {
    const {
      tank_name,
      capacity_liters,
      material_type,
      latitude,
      longitude,
      village_id,
    } = await c.req.json();

    if (!tank_name || !capacity_liters || !village_id) {
      return c.json(
        { success: false, message: "Required fields missing" },
        400
      );
    }

    const tank = await prisma.tank.create({
      data: {
        tank_name,
        capacity_liters,
        material_type,
        latitude,
        longitude,
        village_id,
      },
    });

    return c.json({
      success: true,
      message: "Tank added successfully",
      tank,
    });
  } catch (error) {
    console.error("Add Tank Error:", error);
    return c.json(
      { success: false, message: "Failed to add tank" },
      500
    );
  }
};


export const getAllTanks = async (c: Context) => {
  try {
    const admin = c.get("admin");

    const tanks = await prisma.tank.findMany({
      where: { village_id: admin.village_id }
    });

    return c.json({ success: true, tanks });
  } catch (err) {
    console.error("Get Tanks Error:", err);
    return c.json({ success: false, message: "Failed to fetch tanks" }, 500);
  }
};

