import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "~/server/db/schema";
import type { H3Event } from "h3";
export function useDb(event?: H3Event) {
  const client = postgres(process.env.DB_URL!);
  return drizzle({ client, schema });
}
