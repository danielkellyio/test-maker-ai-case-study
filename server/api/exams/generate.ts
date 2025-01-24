import { z } from "zod";
import { serverSupabaseUser } from "#supabase/server";

export default defineApiEventHandler({
  validation: z.object({
    examId: z.string().uuid(),
    numberOfQuestions: z.coerce.number().optional().default(10),
  }),
  async handler(event, payload) {
    const user = await serverSupabaseUser(event);
    if (!user) throw Error("User not found");

    // Get the anthropic service to generate the exam
    const { generateExam } = await useAnthropicService(event);
    const { createQuestions } = await useQuestionsService(event);

    try {
      // Get the exam from the database and generate test content
      const generatedExam = await generateExam(
        {
          id: payload.examId,
          createdBy: user.id,
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
