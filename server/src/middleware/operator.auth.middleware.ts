import { Context, Next } from "hono";
import { verifyJwt } from "../lib/jwt";
import { prisma } from "../lib/prisma";

export const operatorAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      { success: false, message: "Unauthorized operator" },
      401
    );
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = verifyJwt(token) as {
      operator_id: number;
      role: string;
    };

    if (decoded.role !== "OPERATOR") {
      return c.json(
        { success: false, message: "Forbidden" },
        403
      );
    }

   
    const operator = await prisma.operator.findUnique({
      where: { operator_id: decoded.operator_id },
      select: {
        operator_id: true,
        name: true,
        village_id: true,
      },
    });

    if (!operator) {
      return c.json(
        { success: false, message: "Operator not found" },
        401
      );
    }


    c.set("operator", operator);

    await next();
  } catch (err) {
    return c.json(
      { success: false, message: "Invalid or expired token" },
      401
    );
  }
};
