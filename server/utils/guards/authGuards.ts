import { serverSupabaseUser } from "#supabase/server";
import { defineAuthGuard } from "..";

export const userIsAuthenticatedGuard = defineAuthGuard(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized - User must be logged in",
    });
  }
});
