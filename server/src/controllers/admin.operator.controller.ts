import { Context } from "hono";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export const registerOperator = async (c: Context) => {
  try {
    const { name, phone, username, password, village_id } =
      await c.req.json();

    
    if (!name || !phone || !username || !password || !village_id) {
      return c.json(
        { error: true, message: "All fields are required" },
        400
      );
    }

    const existing = await prisma.operator.findUnique({
      where: { username },
    });

    if (existing) {
      return c.json(
        { error: true, message: "Operator already exists" },
        409
      );
    }

    
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Create operator
    const operator = await prisma.operator.create({
      data: {
        name,
        phone,
        username,
        password_hash,
        village_id,
      },
    });

    return c.json(
      {
        error: false,
        message: "Operator registered successfully",
        data: {
          operator_id: operator.operator_id,
          username: operator.username,
        },
      },
      201
    );
  } catch (err) {
    console.error("Register operator error:", err);
    return c.json(
      { error: true, message: "Internal server error" },
      500
    );
  }
};

export const handleChangeRequest = async (c: Context) => {
  try {
    const requestId = Number(c.req.param("requestId"));
    const { action, admin_remark } = await c.req.json();

    if (!["APPROVE", "REJECT"].includes(action)) {
      return c.json(
        { success: false, message: "Invalid action" },
        400
      );
    }

    const request = await prisma.changeRequest.findUnique({
      where: { request_id: requestId }
    });

    if (!request) {
      return c.json(
        { success: false, message: "Change request not found" },
        404
      );
    }

    if (request.status !== "PENDING") {
      return c.json(
        { success: false, message: "Request already processed" },
        400
      );
    }

    // =========================
    // REJECT FLOW
    // =========================
    if (action === "REJECT") {
      await prisma.changeRequest.update({
        where: { request_id: requestId },
        data: {
          status: "REJECTED",
          admin_remark,
          resolved_at: new Date()
        }
      });

      return c.json({
        success: true,
        message: "Change request rejected"
      });
    }

    // =========================
    // APPROVE FLOW
    // =========================
    if (!request.pump_id) {
      return c.json(
        { success: false, message: "Pump ID missing in request" },
        400
      );
    }

    // Build update object dynamically
    const pumpUpdateData: any = {};

    if (request.req_pump_name !== null)
      pumpUpdateData.pump_name = request.req_pump_name;

    if (request.req_model_number !== null)
      pumpUpdateData.model_number = request.req_model_number;

    if (request.req_latitude !== null)
      pumpUpdateData.latitude = request.req_latitude;

    if (request.req_longitude !== null)
      pumpUpdateData.longitude = request.req_longitude;

    if (request.req_flow_rate !== null)
      pumpUpdateData.flow_rate_lph = request.req_flow_rate;

    if (request.req_is_smart !== null)
      pumpUpdateData.is_smart_pump = request.req_is_smart;

    // Update pump
    await prisma.pump.update({
      where: { pump_id: request.pump_id },
      data: pumpUpdateData
    });

    // Update request status
    await prisma.changeRequest.update({
      where: { request_id: requestId },
      data: {
        status: "APPROVED",
        admin_remark,
        resolved_at: new Date()
      }
    });

    return c.json({
      success: true,
      message: "Change request approved and applied"
    });

  } catch (err) {
    console.error("Admin ChangeRequest Error:", err);
    return c.json(
      { success: false, message: "Failed to process change request" },
      500
    );
  }
};
