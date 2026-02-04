import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const signJwt = (payload: object, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
