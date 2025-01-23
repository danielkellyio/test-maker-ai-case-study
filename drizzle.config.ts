// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  // a file defining our data structure we'll create in a minute
  schema: "./server/db/schema.ts",

  // the type of database we're using
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
