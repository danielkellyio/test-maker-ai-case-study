import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    // Route params
    id: z.string(),
    // Body
    name: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
  async handler(event, payload) {
    // Get exam service
    const examService = await useExamsService(event);

    // Update exam
    const updatedExam = await examService.updateExam(payload.id, payload);

    if (!updatedExam) {
      throw createError({
        statusCode: 404,
        message: "Exam not found",
      });
    }

    return updatedExam;
  },
});
