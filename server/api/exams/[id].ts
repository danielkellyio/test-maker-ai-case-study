import { z } from "zod";
import { userIsAuthenticatedGuard } from "@/server/utils";

export default defineApiEventHandler({
  /**
   * Validation schema for the request parameters
   */
  validation: z.object({
    id: z.string(), // Route param for exam ID
    include: z.enum(["scannedPages"]).optional(),
  }),

  /**
   * Require user to be authenticated
   */
  guards: [userIsAuthenticatedGuard],

  /**
   * Event handler to get an exam and its scanned pages
   * @returns The exam with its scanned pages
   */
  async handler(event, payload) {
    const { getExam, getExamWithScannedPages } = useExamsService();

    const exam =
      payload.include === "scannedPages"
        ? await getExamWithScannedPages(payload.id)
        : {
            ...(await getExam(payload.id)),
            scannedPages: null,
          };

    if (!exam) {
      throw createError({
        statusCode: 404,
        statusMessage: "Exam not found",
      });
    }

    return exam;
  },
});
