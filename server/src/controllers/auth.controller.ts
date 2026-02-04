import { Context } from "hono";
import { sign } from "hono/jwt";
import prisma from "../db";   // ✅ USE TEAMMATE DB FILE

export const login = async (c: Context) => {
  const { username, password } = await c.req.json();

  // 1. Find user in DB
  const user = await prisma.user.findUnique({
    where: { username }
  });

  // 2. Validate
  if (!user || user.password !== password) {
    return c.json({ error: "Invalid username or password" }, 401);
  }

  // 3. Create token
  const token = await sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    "secret_key"
  );
  

  // 4. Send role to frontend ✅
  return c.json({
    message: "Login success",
    token,
    role: user.role
  });
  
};
 console.log("DB URL =", process.env.DATABASE_URL);
