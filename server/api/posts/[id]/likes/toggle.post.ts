import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    id: z.string(),
  }),
  async handler(event, { id }) {
    // Require user to be logged in to toggle like status
    const session = await requireUserSession(event);
    const likesService = useLikesService();

    return await likesService.toggleLike(id, session.user.id);
  },
});
