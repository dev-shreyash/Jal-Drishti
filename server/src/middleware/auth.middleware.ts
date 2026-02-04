// src/middleware/admin.auth.middleware.ts
import { Context } from "hono";
import { verify } from "hono/jwt";

export const adminAuth = async (c: Context, next: () => Promise<void>) => {
  const auth = c.req.header("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  try {
    const token = auth.split(" ")[1];
    const payload = await verify(token, process.env.JWT_SECRET!);


    if (payload.role !== "ADMIN") {
      return c.json({ success: false, message: "Forbidden" }, 403);
    }

   
    c.set("admin", {
      admin_id: payload.admin_id,
      village_id: payload.village_id,
    });

    console.log("ADMIN PAYLOAD:", payload); 


    await next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    return c.json({ success: false, message: "Invalid token" }, 401);
  }
};
