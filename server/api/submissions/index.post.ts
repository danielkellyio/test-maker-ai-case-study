import { z } from "zod";

// Define the validation schema for a single answer
const answerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.string(),
});

// Define the validation schema for the entire submission
export default defineApiEventHandler({
  validation: z.object({
    examId: z.string().uuid(),
    answers: z.array(answerSchema),
  }),
  async handler(event, payload) {
    const { user } = await useUserService(event);

    const { createSubmission } = await useSubmissionService(event);

    return await createSubmission({
      examId: payload.examId,
      userId: user.id,
      answers: payload.answers,
    });
  },
});
