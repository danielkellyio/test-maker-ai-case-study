import { eq } from "drizzle-orm";

import { questionsTable } from "@/server/db/schema";

type Question = typeof questionsTable.$inferInsert;

export function useQuestionsService() {
  async function getQuestionsForExam(examId: string) {
    const db = useDb();
    return db.query.questionsTable.findMany({
      where: (questionsTable, { eq }) => eq(questionsTable.examId, examId),
    });
  }

  async function createQuestion(question: Question) {
    const db = useDb();
    return db.insert(questionsTable).values(question).returning();
  }

  async function updateQuestion(question: Question) {
    if (!question.id)
      throw createError({
        statusCode: 500,
        message: "Cannot update question without an ID",
      });
    const db = useDb();
    return db
      .update(questionsTable)
      .set(question)
      .where(eq(questionsTable.id, question.id))
      .returning();
  }

  async function deleteQuestion(id: string) {
    if (!id)
      throw createError({
        statusCode: 500,
        message: "Cannot delete question without an ID",
      });
    const db = useDb();
    return db.delete(questionsTable).where(eq(questionsTable.id, id));
  }

  async function getQuestion(id: string) {
    const db = useDb();
    return db.query.questionsTable.findFirst({
      where: (questionsTable, { eq }) => eq(questionsTable.id, id),
    });
  }

  async function createQuestions(questions: Question[]) {
    const db = useDb();
    return db.insert(questionsTable).values(questions).returning();
  }

  return {
    getQuestionsForExam,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestion,
    createQuestions,
  };
}
