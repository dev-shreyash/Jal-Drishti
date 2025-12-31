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
