import { serverSupabaseUser } from "#supabase/server";
import type { H3Event } from "h3";
import type { User } from "@supabase/supabase-js";

export async function useUserService(event?: H3Event) {
  if (!event) {
    throw createError({
      statusCode: 500,
      statusMessage: "H3Event is required to use the userService",
    });
  }

  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  return { user: user as unknown as User };
}
