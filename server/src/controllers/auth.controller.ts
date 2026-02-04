import { Context } from "hono";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";

const ALLOWED_DOMAIN = "@panchayat.com";

export const adminRegister = async (c: Context) => {
  try {
    const {
      name,
      username,
      password,
      email,
      contact_number,
      state,
      district,
      taluka,
      village_name,
    } = await c.req.json();

    // 1. Basic validation
    if (
      !name ||
      !username ||
      !password ||
      !email ||
      !state ||
      !district ||
      !taluka ||
      !village_name
    ) {
      return c.json(
        { success: false, message: "All fields are required" },
        400,
      );
    }

    // 2. Email domain validation
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      return c.json(
        {
          success: false,
          message: "Only panchayat-issued emails are allowed",
        },
        400,
      );
    }

    // 3. Find village by full hierarchy
    const village = await prisma.village.findFirst({
      where: {
        state,
        district,
        taluka,
        village_name,
      },
    });

    if (!village) {
      return c.json(
        {
          success: false,
          message: "Selected village does not exist",
        },
        404,
      );
    }

    // 4. Check admin username
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return c.json(
        { success: false, message: "Admin username already exists" },
        409,
      );
    }

    // 5. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 6. Create admin linked to village
    const admin = await prisma.admin.create({
      data: {
        name,
        username,
        password_hash: passwordHash,
        email,
        contact_number,
        village_id: village.village_id,
      },
    });

    return c.json({
      success: true,
      message: "Admin registered successfully",
      admin_id: admin.admin_id,
      village: {
        village_id: village.village_id,
        village_name: village.village_name,
        taluka: village.taluka,
        district: village.district,
        state: village.state,
      },
    });
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Admin registration failed" },
      500,
    );
  }
};

export const adminLogin = async (c: Context) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ message: "Username and password required" }, 400);
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const token = await sign(
      {
        admin_id: admin.admin_id,
        role: "ADMIN",
        village_id: admin.village_id,
      },
      process.env.JWT_SECRET!,
    );

    return c.json({
      token,
      admin: {
        id: admin.admin_id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Login failed" }, 500);
  }
};

export const createAnnouncement = async (c: Context) => {
  try {
    const admin = c.get("admin");

    if (!admin?.village_id) {
      return c.json(
        { success: false, message: "Admin village not found" },
        403,
      );
    }

    const { title, message } = await c.req.json();

    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        village_id: admin.village_id,
      },
    });

    return c.json({
      success: true,
      announcement,
    });
  } catch (err) {
    console.error("Announcement Error:", err);
    return c.json(
      { success: false, message: "Failed to create announcement" },
      500,
    );
  }
};
