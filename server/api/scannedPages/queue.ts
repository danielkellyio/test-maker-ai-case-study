import { z } from "zod";
import { useAnthropicService, useExamsService } from "~/server/utils/services";
import { userIsAuthenticatedGuard } from "@/server/utils";
import { serverSupabaseUser } from "#supabase/server";

export default defineApiEventHandler({
  /**
   * @param images - Array of image urls
   */
  validation: z.object({
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
    const { createExam } = useExamsService();

    // create a new exam for the scanned pages
    const exam = await createExam({
      name: "New Exam from Scanned Pages",
      description: "Exam created from scanned pages",
      // createdBy: user.id,
    });

    if (!exam) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create exam",
      });
    }

    // insert the scanned pages into the exam
    const images = await Promise.all(
      payload.images.map(async (imageUrl) => {
        const image = await fetch(imageUrl);
        return image;
      })
    );
    const { insertPages } = useScannedPagesService();
    const result = await insertPages(
      images.map((image) => {
        return {
          pageImage: image.url,
          status: "pending",
          examId: exam.id,
        };
      })
    ).returning();

    return {
      scannedPages: result,
      exam,
    };
  },
});
