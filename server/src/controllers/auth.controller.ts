import { Context } from "hono";
import { sign } from "hono/jwt";

export const login = async (c: Context) => {
  const { username, password } = await c.req.json();

  if (username !== "admin" || password !== "admin123") {
    return c.json({ error: "Invalid login" }, 401);
  }

  const payload = {
    username,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600
  };

  const token = await sign(
    payload,
    "secret_key"
  );

  return c.json({
    message: "Login success",
    token
  });
};
