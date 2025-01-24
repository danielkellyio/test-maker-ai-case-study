import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    examId: z.string().uuid(),
    numberOfQuestions: z.coerce.number().optional().default(10),
  }),
  async handler(event, payload) {
    const { generateExam } = await useAnthropicService(event);
    const { createQuestions } = await useQuestionsService(event);
    const { deleteExamQuestions } = await useExamsService(event);

    try {
      // delete all existing exam questions
      await deleteExamQuestions(payload.examId);

      // Get the exam from the database and generate test content
      const generatedExam = await generateExam(
        {
          id: payload.examId,
        },
        payload
      );

      // Create the questions in the database
      const questions = await createQuestions(
        generatedExam.questions.map((question) => {
          return {
            ...question,
            examId: payload.examId,
          };
        })
      );

      return questions;
    } catch (error) {
      console.error("Error generating exam:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to generate exam",
      });
    }
  },
});
