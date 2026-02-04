import type { Context } from "hono";
import prisma from "../db";

export const getVillages = async (c: Context) => {
  const villages = await prisma.village.findMany({
    orderBy: { village_id: "desc" },
  });

  return c.json(villages);
};

export const createVillage = async (c: Context) => {
  const { village_name, district, population } = await c.req.json();

  const village = await prisma.village.create({
    data: {
      village_name,
      district,
      population,
      taluka: "NA",
      state: "Maharashtra",
      pincode: "000000",
    },
  });

  return c.json(village);
};

export const updateVillage = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const { village_name, district, population } = await c.req.json();

  const village = await prisma.village.update({
    where: { village_id: id },
    data: { village_name, district, population },
  });

  return c.json(village);
};

export const deleteVillage = async (c: Context) => {
  const id = Number(c.req.param("id"));

  await prisma.village.delete({
    where: { village_id: id },
  });

  return c.json({ success: true });
};
