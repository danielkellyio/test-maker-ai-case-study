import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    id: z.string(),
  }),
  async handler(event, { id }) {
    const likesService = useLikesService();
    return await likesService.getLikes(id);
  },
});
