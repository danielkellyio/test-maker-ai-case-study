import { z } from "zod";
import { userIsAuthenticatedGuard } from "@/server/utils";

export default defineApiEventHandler({
  validation: z.object({
    id: z.string().uuid(),
  }),
  guards: [userIsAuthenticatedGuard],
  async handler(event, payload) {
    const { setPageStatus, getPage } = await useScannedPagesService(event);

    // Set the page back to pending status
    await setPageStatus(payload.id, "pending");

    // Get the page
    const page = await getPage(payload.id);

    return page;
  },
});
