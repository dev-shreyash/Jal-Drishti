import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { identifier, password, role } = req.body;

  let user: any;

  if (role === "admin") {
    user = await prisma.admin.findUnique({
      where: { username: identifier },
      include: { village: true },
    });
  }

  if (role === "operator") {
    user = await prisma.operator.findUnique({
      where: { username: identifier },
      include: { village: true },
    });

    if (user && !user.is_active) {
      return res.status(403).json({ error: "Operator inactive" });
    }
  }

  if (role === "resident") {
    user = await prisma.resident.findUnique({
      where: { phone: identifier },
      include: { village: true },
    });
  }

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: user.admin_id || user.operator_id || user.resident_id,
      role,
      village_id: user.village_id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: {
      id: user.admin_id || user.operator_id || user.resident_id,
      name: user.name,
      role,
      village_id: user.village_id,
      username: user.username,
      phone: user.phone,
      village: user.village,
      is_active: user.is_active,
    },
  });
};
