import { z } from "zod";
import { userIsAuthenticatedGuard } from "@/server/utils";

export default defineApiEventHandler({
  /**
   * Validation schema for the request parameters
   */
  validation: z.object({
    id: z.string(), // Route param for exam ID
    include: z.enum(["scannedPages", "questions"]).optional(),
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
    const { getExam, getExamWithScannedPages, getExamWithQuestions } =
      useExamsService();
    let exam;

    if (payload.include?.includes("scannedPages")) {
      exam = await getExamWithScannedPages(payload.id);
    }

    if (payload.include?.includes("questions")) {
      exam = await getExamWithQuestions(payload.id);
    }

    if (!payload.include || !payload.include.length) {
      exam = await getExam(payload.id);
    }

    if (!exam) {
      throw createError({
        statusCode: 404,
        statusMessage: "Exam not found",
      });
    }

    return exam;
  },
});
