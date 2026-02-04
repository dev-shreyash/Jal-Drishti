import prisma from "../db";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const login = async (c: any) => {
  const { username, password } = await c.req.json();

  // check admin
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (admin && await bcrypt.compare(password, admin.password_hash)) {
    const token = jwt.sign(
      { id: admin.admin_id, role: "admin" },
      "secret",
      { expiresIn: "1d" }
    );

    return c.json({ token, role: "admin", username });
  }

  // check operator
  const operator = await prisma.operator.findUnique({ where: { username } });
  if (operator && await bcrypt.compare(password, operator.password_hash)) {
    const token = jwt.sign(
      { id: operator.operator_id, role: "operator" },
      "secret",
      { expiresIn: "1d" }
    );

    return c.json({ token, role: "operator", username });
  }

  return c.json({ message: "Invalid credentials" }, 401);
};
