import { Context } from "hono";
import prisma from "../db";
import * as bcrypt from "bcryptjs";
import { sign } from "hono/jwt";

export const operatorLogin = async (c: Context) => {
  const { username, password } = await c.req.json();
  console.log(username)

  const operator = await prisma.operator.findUnique({
    where: { username },
  });

  console.log(operator)

  if (!operator) {
    return c.json({ error: "Operator not found" }, 401);
  }

  const valid = await bcrypt.compare(password, operator.password_hash);
  if (!valid) {
    return c.json({ error: "Invalid password" }, 401);
  }

  const token = await sign(
    {
      id: operator.operator_id,
      role: "OPERATOR",
      username: operator.username,
    },
    "secret_key"
  );

  return c.json({
    message: "Operator login success",
    token,
    role: "OPERATOR",
  });
};
