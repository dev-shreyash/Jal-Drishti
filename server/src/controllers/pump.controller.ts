import { Context } from "hono";
import { prisma } from "../lib/prisma";

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
