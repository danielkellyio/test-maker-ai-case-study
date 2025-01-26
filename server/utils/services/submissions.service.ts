import { submissionsTable, submissionAnswersTable } from "../../db/schema";
import type { H3Event } from "h3";

export async function useSubmissionService(event: H3Event) {
  const db = useDb();

  /**
   * Creates a new submission and its associated answers
   */
  async function createSubmission({
    examId,
    userId,
    answers,
  }: {
    examId: string;
    userId: string;
    answers: Array<{
      questionId: string;
      answer: string;
    }>;
  }) {
    // Create the submission
    const [submission] = await db
      .insert(submissionsTable)
      .values({
        examId,
        userId,
      })
      .returning();

    // Create all the submission answers
    await db.insert(submissionAnswersTable).values(
      answers.map((answer) => ({
        submissionId: submission.id,
        questionId: answer.questionId,
        answer: answer.answer,
      }))
    );

    return submission;
  }

  return { createSubmission };
}
