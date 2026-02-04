//controollers/admin.controller.ts

import { Context } from "hono";
import prisma from "../db"; 
import bcrypt from "bcryptjs"; 

const ADMIN_SECRET = "jal_drishti_admin_2025";

export const registerAdmin = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log("1. Request Body:", body);
    
    const { name, username, password, village_id, secret_key, email, contact_number } = body;

    // --- Validations ---
    if (!name || !username || !password || !village_id || !secret_key || !email || !contact_number) {
      return c.json({ message: "All fields are required." }, 400);
    }

    if (secret_key !== ADMIN_SECRET) {
      return c.json({ message: "Forbidden: Invalid Secret Key" }, 403);
    }

    // --- DB Check 1: Village ---
    console.log("2. Checking Village...");
    const villageExists = await prisma.village.findUnique({
      where: { village_id: Number(village_id) },
    });
    console.log("3. Village Found:", villageExists?.village_name); 

    if (!villageExists) {
      return c.json({ message: "Selected Village does not exist" }, 404);
    }

    // --- DB Check 2: Username ---
    console.log("4. Checking Username...");
    const userExists = await prisma.admin.findUnique({ where: { username } });
    console.log("5. User Check Result:", userExists);

    if (userExists) {
      return c.json({ message: "Username already taken" }, 400);
    }

    // --- HASHING (The Stuck Point) ---
    console.log("6. Starting Password Hash...");
    // FIX: Use hashSync to prevent async hang
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log("7. Password Hashed Successfully!");

    // --- DB Create: Admin ---
    console.log("8. Creating Admin in DB...");
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        username,
        password_hash: hashedPassword,
        village_id: Number(village_id),
        email,
        contact_number
      },
    });

    console.log("9. Admin Created:", newAdmin.admin_id);

    return c.json({ 
      message: "Admin registered successfully", 
      admin_id: newAdmin.admin_id 
    }, 201);

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    return c.json({ message: "Internal Server Error", error: String(error) }, 500);
  }
};
export const getAllDailyLogs = async (c: Context) => {
  try {
    const logs = await prisma.dailyLog.findMany({
      include: {
        operator: {
          select: {
            name: true,
          },
        },
        pump: {
          select: {
            pump_name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return c.json(logs, 200);
  } catch (error) {
    return c.json({ message: "Failed to fetch daily logs" }, 500);
  }
};
