import prisma from "../db";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Context } from "hono";

export const operatorLogin = async (c: Context) => {
  const body = await c.req.json();

  const operator = await prisma.operator.findUnique({
    where: { username: body.username },
  });

  if (!operator) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const isMatch = await bcrypt.compare(
    body.password,
    operator.password_hash
  );

  if (!isMatch) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const token = jwt.sign(
    { id: operator.operator_id, role: "operator" },
    "secret",
    { expiresIn: "1d" }
  );

  return c.json({
    token,
    role: "operator",
    username: operator.username,
  });
};
