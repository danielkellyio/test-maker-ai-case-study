import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function useDb() {
  const client = postgres(process.env.DB_URL!);
  return drizzle({ client });
}
