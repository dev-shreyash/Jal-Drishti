import * as jwt from "jsonwebtoken";

export const auth = (role?: "admin" | "operator") => {
  return async (c: any, next: any) => {
    const header = c.req.header("authorization");
    if (!header) return c.json({ message: "No token" }, 401);

    const token = header.replace("Bearer ", "");

    try {
      const decoded: any = jwt.verify(token, "secret");
      if (role && decoded.role !== role) {
        return c.json({ message: "Forbidden" }, 403);
      }

      c.set("user", decoded);
      await next();
    } catch {
      return c.json({ message: "Invalid token" }, 401);
    }
  };
};
