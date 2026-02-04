import { Context } from "hono";
import {prisma} from "../lib/prisma";

export const createDailyLog = async (c: Context) => {
  try {
  
    const operator = c.get("operator");
    if (!operator) {
      return c.json(
        { success: false, message: "Unauthorized operator" },
        401
      );
    }

    const operatorId = operator.operator_id;

    const body = await c.req.json();
    const {
      pump_id,
      start_time,
      end_time,
      chlorine_added,
      gps_lat,
      gps_lng
    } = body;

    if (
      !pump_id ||
      !start_time ||
      !end_time ||
      gps_lat === undefined ||
      gps_lng === undefined
    ) {
      return c.json(
        { success: false, message: "All fields including GPS are required" },
        400
      );
    }

   
    const pump = await prisma.pump.findUnique({
      where: { pump_id }
    });

    if (!pump) {
      return c.json(
        { success: false, message: "Invalid pump" },
        400
      );
    }

   
    const start = new Date(start_time);
    const end = new Date(end_time);

    const hours =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (hours <= 0) {
      return c.json(
        { success: false, message: "Invalid time range" },
        400
      );
    }

    const usage_liters = hours * pump.flow_rate_lph;

   
    const log = await prisma.dailyLog.create({
      data: {
        operator_id: operatorId,
        pump_id,
        start_time: start,
        end_time: end,
        chlorine_added: Boolean(chlorine_added),
        usage_liters,
        gps_lat,
        gps_lng
      }
    });

    return c.json({
      success: true,
      message: "Daily log created successfully",
      log
    });

  } catch (error) {
    console.error("DailyLog Error:", error);
    return c.json(
      { success: false, message: "Failed to create daily log" },
      500
    );
  }
};
