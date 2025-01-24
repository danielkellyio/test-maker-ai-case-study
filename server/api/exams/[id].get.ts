import { z } from "zod";
import { userIsAuthenticatedGuard } from "@/server/utils";
import type {
  examsTable,
  scannedPagesTable,
  questionsTable,
} from "~/server/db/schema";

export type Exam = typeof examsTable.$inferSelect & {
  questionsCount?: number;
  scannedPagesCount?: number;
  scannedPages?: (typeof scannedPagesTable.$inferSelect)[];
  questions?: (typeof questionsTable.$inferSelect)[];
};

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
  async handler(event, payload): Promise<Exam> {
    const { getExam, getExamWithScannedPages, getExamWithQuestions } =
      await useExamsService(event);

    let exam: Exam | undefined;

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
