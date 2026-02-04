import { Context } from "hono";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";

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
      process.env.JWT_SECRET!
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
        403
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
      500
    );
  }
};
