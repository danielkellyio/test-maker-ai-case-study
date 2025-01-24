import { z } from "zod";
import { userIsAuthenticatedGuard } from "@/server/utils";
import { serverSupabaseUser } from "#supabase/server";

export default defineApiEventHandler({
  /**
   * @param images - Array of image urls
   */
  validation: z.object({
    examId: z.string().optional(),
    images: z.array(z.string()), // Array of image urls
  }),
  /**
   * Require user to be authenticated
   */
  guards: [userIsAuthenticatedGuard],

  /**
   * Event handler
   * returns an array of scanned pages with their extracted text
   */
  async handler(event, payload) {
    const user = await serverSupabaseUser(event);
    if (!user) throw Error("User not found");

    const { createExam, getExam } = await useExamsService(event);

    let exam;

    // create a new exam for the scanned pages
    if (!payload.examId) {
      exam = await createExam({
        name: "New Exam from Scanned Pages",
        description: "Exam created from scanned pages",
        createdBy: user.id,
      });
    } else {
      exam = await getExam(payload.examId);
    }

    if (!exam) {
      throw createError({
        statusCode: 500,
        statusMessage: payload.examId
          ? "Failed to find an existing exam"
          : "Failed to create an exam",
      });
    }

    // insert the scanned pages into the exam
    const images = await Promise.all(
      payload.images.map(async (imageUrl) => {
        const image = await fetch(imageUrl);
        return image;
      })
    );
    const { insertPages } = await useScannedPagesService(event);
    const result = await insertPages(
      images.map((image) => {
        return {
          pageImage: image.url,
          status: "pending",
          examId: exam.id,
          createdBy: user.id,
        };
      })
    ).returning();

    return {
      scannedPages: result,
      exam,
    };
  },
});
