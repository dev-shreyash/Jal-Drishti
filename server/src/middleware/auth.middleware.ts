import { Context, Next } from "hono";
import { verify } from "hono/jwt";

// ⚠️ CRITICAL: This must match the secret used in your Login Controller
const JWT_SECRET = process.env.JWT_SECRET || "jal_drishti_admin_2025";

export const adminAuth = async (c: Context, next: Next) => {
  const auth = c.req.header("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized: Missing Header" }, 401);
  }

  try {
    const token = auth.split(" ")[1];
    
    // 1. Verify using the defined secret (handles fallback if .env is missing)
    const payload = await verify(token, JWT_SECRET, "HS256");

    // 2. Check Role
    if (payload.role !== "ADMIN") {
      return c.json({ success: false, message: "Forbidden: Admins Only" }, 403);
    }

   
    c.set("jwtPayload", payload);

    console.log("✅ Admin Auth Success:", payload.username); 

    await next();
  } catch (err) {
    console.error("❌ Token Verification Failed:", err);
    return c.json({ success: false, message: "Invalid or Expired Token" }, 401);
  }
};