import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    examId: z.string().uuid(),
    numberOfQuestions: z.coerce.number().optional().default(10),
  }),
  async handler(event, payload) {
    // Get the anthropic service to generate the exam
    const { generateExam } = useAnthropicService();

    try {
      // Get the exam from the database and generate test content
      const generatedExam = await generateExam(
        {
          id: payload.examId,
        },
        payload
      );

      return generatedExam;
    } catch (error) {
      console.error("Error generating exam:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to generate exam",
      });
    }
  },
});
