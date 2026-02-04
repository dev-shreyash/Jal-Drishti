import { Hono } from "hono";
import prisma from "../db";
import * as bcrypt from "bcrypt";
import { auth } from "../middleware/auth";
import {
  createDailyLog,
  getMyDailyLogs,
} from "../controllers/operator.controller";

const operatorRoutes = new Hono();

/* ===============================
   OPERATOR DAILY LOGS
================================ */
operatorRoutes.post("/daily-logs", auth("operator"), createDailyLog);
operatorRoutes.get("/daily-logs", auth("operator"), getMyDailyLogs);

/* ===============================
   OPERATOR CRUD (ADMIN SIDE)
================================ */
operatorRoutes.get("/", async (c) => {
  const operators = await prisma.operator.findMany({
    include: { village: true },
  });
  return c.json(operators);
});

operatorRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const hash = await bcrypt.hash(body.password, 10);

  const operator = await prisma.operator.create({
    data: {
      name: body.name,
      phone: body.phone,
      username: body.username,
      password_hash: hash,
      is_active: body.is_active ?? true,
      village_id: Number(body.village_id),
    },
  });

  return c.json(operator);
});

operatorRoutes.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const data: any = {
    name: body.name,
    phone: body.phone,
    is_active: body.is_active,
    village_id: Number(body.village_id),
  };

  if (body.password) {
    data.password_hash = await bcrypt.hash(body.password, 10);
  }

  const operator = await prisma.operator.update({
    where: { operator_id: id },
    data,
  });

  return c.json(operator);
});

operatorRoutes.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await prisma.operator.delete({ where: { operator_id: id } });
  return c.json({ success: true });
});

export default operatorRoutes;
