import "dotenv/config";
import { defineConfig, env } from "prisma/config";


// export default defineConfig({
//  datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
//   migrations: {
//     // @ts-ignore - 
//     directUrl: process.env.DIRECT_URL,
//   }
// });

export default defineConfig({
  schema: "prisma/schema.prisma",
  // You might have migrations/seed paths here too, keep them if you do!
  datasource: {
    url: env("DIRECT_URL"), // CLI will use the non-pooled connection for migrations 🚀
  },
});