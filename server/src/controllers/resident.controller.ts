import { Context } from "hono";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signJwt } from "../lib/jwt";
import { verifyJwt } from "../lib/jwt";

export const registerResident = async (c: Context) => {
  try {
    const { name, phone, password, village_id, address } = await c.req.json();

    if (!name || !phone || !password || !village_id) {
      return c.json(
        { success: false, message: "All required fields must be provided" },
        400
      );
    }

    // Check if resident already exists
    const existing = await prisma.resident.findUnique({
      where: { phone }
    });

    if (existing) {
      return c.json(
        { success: false, message: "Resident already registered" },
        409
      );
    }

    // Check village exists
    const village = await prisma.village.findUnique({
      where: { village_id }
    });

    if (!village) {
      return c.json(
        { success: false, message: "Invalid village" },
        400
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const resident = await prisma.resident.create({
      data: {
        name,
        phone,
        password_hash: passwordHash,
        address,
        village_id
      }
    });

    return c.json({
      success: true,
      message: "Resident registered successfully",
      resident: {
        id: resident.resident_id,
        name: resident.name,
        phone: resident.phone
      }
    });
  } catch (err) {
    console.error("Resident Register Error:", err);
    return c.json(
      { success: false, message: "Registration failed" },
      500
    );
  }
};

export const residentLogin = async (c: Context) => {
  try {
    const { phone, password } = await c.req.json();

    if (!phone || !password) {
      return c.json(
        { success: false, message: "Phone and password required" },
        400
      );
    }

    const resident = await prisma.resident.findUnique({
      where: { phone }
    });

    if (!resident) {
      return c.json(
        { success: false, message: "Resident not found" },
        404
      );
    }

    const valid = await bcrypt.compare(password, resident.password_hash);

    if (!valid) {
      return c.json(
        { success: false, message: "Invalid password" },
        401
      );
    }

    const token = signJwt({
      resident_id: resident.resident_id,
      role: "RESIDENT",
      village_id: resident.village_id
    });

    return c.json({
      success: true,
      token,
      resident: {
        id: resident.resident_id,
        name: resident.name,
        phone: resident.phone
      }
    });
  } catch (err) {
    console.error("Resident Login Error:", err);
    return c.json(
      { success: false, message: "Login failed" },
      500
    );
  }
};

export const raiseComplaint = async (c: Context) => {
  try {
    const resident = c.get("resident");
    const body = await c.req.json();

    const {
      category,
      description,
      photo_url,
      pump_id,
    } = body;

    if (!category || !description) {
      return c.json(
        { success: false, message: "Category and description required" },
        400
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        category,
        description,
        photo_url: photo_url ?? null,
        pump_id: pump_id ?? null,

        // ✅ ONLY fields that exist in schema
        resident_id: resident.resident_id,
      },
    });

    return c.json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (err) {
    console.error("Resident Complaint Error:", err);
    return c.json(
      { success: false, message: "Failed to submit complaint" },
      500
    );
  }
};

export const getMyComplaints = async (c: Context) => {
  try {
    const residentId = c.get("resident_id");

    const complaints = await prisma.complaint.findMany({
      where: { resident_id: residentId },
      orderBy: { created_at: "desc" },
      include: {
        pump: {
          select: {
            pump_name: true,
          },
        },
      },
    });

    return c.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to fetch complaints" },
      500
    );
  }
};

export const getAnnouncements = async (c: Context) => {
  try {
    const villageId = c.get("village_id");

    const announcements = await prisma.announcement.findMany({
      where: { village_id: villageId },
      orderBy: { date_posted: "desc" },
    });

    return c.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to fetch announcements" },
      500
    );
  }
};

export const getWaterStatus = async (c: Context) => {
  try {
    const villageId = c.get("village_id");

    const latestPrediction = await prisma.prediction.findFirst({
      where: {
        pump: {
          village_id: villageId,
        },
      },
      orderBy: { prediction_date: "desc" },
    });

    if (!latestPrediction) {
      return c.json({
        success: true,
        status: "UNKNOWN",
        message: "No data available",
      });
    }

    return c.json({
      success: true,
      status: latestPrediction.shortage_flag ? "SHORTAGE" : "SAFE",
      confidence: latestPrediction.confidence_score,
    });
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to fetch water status" },
      500
    );
  }
};



