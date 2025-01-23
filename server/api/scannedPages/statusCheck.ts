import { z } from "zod";
import { scannedPagesTable } from "~/server/db/schema";
import { userIsAuthenticatedGuard } from "@/server/utils";

export default defineApiEventHandler({
  /**
   * @param ids - Array of scanned page IDs to check status for
   */
  validation: z.object({
    ids: z.array(z.string().uuid()),
  }),

  /**
   * Require user to be authenticated
   */
  guards: [userIsAuthenticatedGuard],

  /**
   * Event handler
   * Returns array of scanned pages with their current processing status
   */
  async handler(event, payload) {
    const { pagesHaveBeenProccessed } = useScannedPagesService();
    const complete = pagesHaveBeenProccessed(payload.ids);

    return {
      complete,
    };
  },
});
