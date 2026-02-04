import { Request, Response } from "express";
import prisma from "../db";

export const getAllDailyLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.dailyLog.findMany({
      include: {
        operator: {
          select: {
            name: true,
          },
        },
        pump: {
          select: {
            pump_name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch daily logs" });
  }
};
