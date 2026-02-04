import { Context } from "hono";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signJwt } from "../lib/jwt";

export const operatorLogin = async (c: Context) => {
  try {
    const { mobile, password } = await c.req.json();

    if (!mobile || !password) {
      return c.json(
        { success: false, message: "Mobile and password required" },
        400
      );
    }

    const operator = await prisma.operator.findFirst({
      where: {
        phone: mobile,
        is_active: true,
      },
    });

    if (!operator) {
      return c.json({ success: false, message: "Operator not found" }, 404);
    }

    const valid = await bcrypt.compare(password, operator.password_hash);

    if (!valid) {
      return c.json({ success: false, message: "Invalid password" }, 401);
    }

    const token = signJwt({
      operator_id: operator.operator_id,
      role: "OPERATOR",
      village_id: operator.village_id,
    });

    return c.json({
      success: true,
      token,
      operator: {
        id: operator.operator_id,
        name: operator.name,
        phone: operator.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ success: false, message: "Login failed" }, 500);
  }
};

export const createChangeRequest = async (c: Context) => {
  try {
    const operator = c.get("operator");
    const body = await c.req.json();


    if (body.request_type === "UPDATE" && !body.pump_id) {
      return c.json(
        { success: false, message: "pump_id is required for update request" },
        400
      );
    }

   
    let pump = null;
    if (body.pump_id) {
      pump = await prisma.pump.findFirst({
        where: {
          pump_id: body.pump_id,
          village_id: operator.village_id,
        },
      });

      if (!pump) {
        return c.json(
          { success: false, message: "Pump not found or unauthorized" },
          403
        );
      }
    }

   
    const request = await prisma.changeRequest.create({
      data: {
        request_type: body.request_type, // CREATE | UPDATE
        operator_id: operator.operator_id,
        pump_id: body.pump_id ?? null,

        req_pump_name: body.pump_name ?? null,
        req_model_number: body.model_number ?? null,
        req_latitude: body.latitude ?? null,
        req_longitude: body.longitude ?? null,
        req_flow_rate: body.flow_rate_lph ?? null,
        req_is_smart: body.is_smart_pump ?? null,

        reason: body.reason ?? null,
      },
    });

    return c.json({
      success: true,
      message: "Change request sent for admin approval",
      request,
    });
  } catch (err) {
    console.error("ChangeRequest Error:", err);
    return c.json(
      { success: false, message: "Failed to create request" },
      500
    );
  }
};



