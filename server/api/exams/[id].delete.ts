import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    // The ID comes from the route params
    id: z.string().min(1),
  }),
  async handler(event, { id }) {
    // Get the exams service
    const { deleteExam } = await useExamsService(event);

    // Delete the exam
    await deleteExam(id);

    // Return 204 No Content for successful deletion
    return {
      statusCode: 204,
    };
  },
});
