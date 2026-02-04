import jwt from "jsonwebtoken";

export const signToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);
