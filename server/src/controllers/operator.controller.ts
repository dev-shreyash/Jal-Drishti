import { Context } from "hono";
import prisma from "../db";
import * as bcrypt from "bcrypt";

// --- GET ALL OPERATORS ---
export const getOperators = async (c: Context) => {
  try {
    const payload = c.get("jwtPayload");
    
    // 👇 FIX: Support both id and admin_id from token
    const adminId = payload?.id || payload?.admin_id;

    if (!adminId) {
      return c.json({ error: "Invalid Token: Missing Admin ID" }, 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(adminId) },
      select: { village_id: true }
    });

    if (!admin?.village_id) {
      return c.json({ error: "Admin has no assigned village" }, 403);
    }

    const operators = await prisma.operator.findMany({
      where: { village_id: admin.village_id },
      include: { 
        village: { select: { village_name: true } } 
      },
      orderBy: { 
        operator_id: 'desc' // 👈 FIX: Use operator_id instead of created_at
      }
    });

    return c.json(operators);
  } catch (error) {
    console.error("Get Operators Error:", error);
    return c.json({ error: "Failed to fetch operators" }, 500);
  }
};

// --- CREATE OPERATOR ---
export const createOperator = async (c: Context) => {
  try {
    const body = await c.req.json();
    const payload = c.get("jwtPayload");
    
    // 👇 FIX: Support both id and admin_id
    const adminId = payload?.id || payload?.admin_id;

    if (!adminId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(adminId) },
      select: { village_id: true }
    });

    if (!admin?.village_id) {
      return c.json({ error: "Unauthorized: Admin has no village" }, 403);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newOperator = await prisma.operator.create({
      data: {
        name: body.name,
        phone: body.contact_number,
        username: body.username,
        password_hash: hashedPassword,
        village_id: admin.village_id, // Auto-assign
      }
    });

    const { password_hash, ...safeOperator } = newOperator;
    return c.json(safeOperator, 201);
  } catch (error) {
    console.error("Create Operator Error:", error);
    return c.json({ error: "Failed to create operator" }, 500);
  }
};

// --- UPDATE OPERATOR ---
export const updateOperator = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    const updateData: any = {
      name: body.name,
      contact_number: body.contact_number,
      username: body.username
    };

    if (body.password) {
      updateData.password_hash = await bcrypt.hash(body.password, 10);
    }

    const updatedOperator = await prisma.operator.update({
      where: { operator_id: id },
      data: updateData
    });

    return c.json(updatedOperator);
  } catch (error) {
    return c.json({ error: "Update failed" }, 500);
  }
};

// --- DELETE OPERATOR ---
export const deleteOperator = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    await prisma.operator.delete({ where: { operator_id: id } });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Delete failed" }, 500);
  }
};