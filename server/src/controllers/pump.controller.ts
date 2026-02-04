import { Context } from "hono";
import { prisma } from "../lib/prisma";

export const addPump = async (c: Context) => {
  try {
    const {
      pump_name,
      qr_code,
      latitude,
      longitude,
      flow_rate_lph,
      village_id,
    } = await c.req.json();

    if (
      !pump_name ||
      !qr_code ||
      latitude === undefined ||
      longitude === undefined ||
      !flow_rate_lph ||
      !village_id
    ) {
      return c.json(
        { success: false, message: "All fields are required" },
        400
      );
    }

    const pump = await prisma.pump.create({
      data: {
        pump_name,
        qr_code,
        latitude,
        longitude,
        flow_rate_lph,
        village_id,
      },
    });

    return c.json({
      success: true,
      message: "Pump added successfully",
      pump,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json(
        { success: false, message: "QR code already exists" },
        409
      );
    }

    console.error("Add Pump Error:", error);
    return c.json(
      { success: false, message: "Failed to add pump" },
      500
    );
  }
};

export const getPumpByQr = async (c: Context) => {
  try {

    const { qrCode } = c.req.param();

    const operator = c.get("operator") as {
      operator_id: number;
      village_id: number;
    };

    if (!qrCode) {
      return c.json(
        { success: false, message: "QR code is required" },
        400
      );
    }

    const pump = await prisma.pump.findFirst({
      where: {
        qr_code: qrCode,
        village_id: operator.village_id,
      },
      select: {
        pump_id: true,
        pump_name: true,
        flow_rate_lph: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!pump) {
      return c.json(
        { success: false, message: "Pump not found or unauthorized" },
        404
      );
    }

    return c.json({
      success: true,
      pump,
    });
  } catch (err) {
    console.error("Pump Lookup Error:", err);
    return c.json(
      { success: false, message: "Failed to fetch pump details" },
      500
    );
  }
};
