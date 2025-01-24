import { z } from "zod";
import { userIsAuthenticatedGuard } from "@/server/utils";

export default defineApiEventHandler({
  /**
   * Validation schema for creating a new exam
   */
  validation: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),

  /**
   * Require user to be authenticated
   */
  guards: [userIsAuthenticatedGuard],

  /**
   * Handler to create a new exam
   */
  async handler(event, payload) {
    // Get exam service
    const { createExam } = await useExamsService(event);

    // Get authenticated user
    const { user } = await useUserService(event);

    try {
      // Create new exam
      const exam = await createExam({
        ...payload,
        createdBy: user.id,
      });

      return exam;
    } catch (error) {
      console.error("Error creating exam:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to create exam",
      });
    }
  },
});
