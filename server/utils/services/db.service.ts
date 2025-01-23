import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "~/server/db/schema";

export function useDb() {
  const client = postgres(process.env.DB_URL!);
  return drizzle({ client, schema });
}
