import { Context, Next } from "hono";
import { verifyJwt } from "../lib/jwt";

export const residentAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      { success: false, message: "Unauthorized resident" },
      401
    );
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = verifyJwt(token) as {
      resident_id: number;
      role: string;
      village_id: number;
    };

    if (decoded.role !== "RESIDENT") {
      return c.json(
        { success: false, message: "Forbidden" },
        403
      );
    }

    // attach resident to context
    c.set("resident", decoded);

    await next();
  } catch (err) {
    return c.json(
      { success: false, message: "Invalid or expired token" },
      401
    );
  }
};
