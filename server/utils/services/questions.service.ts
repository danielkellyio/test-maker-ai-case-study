import { eq } from "drizzle-orm";
import { questionsTable, optionsTable } from "@/server/db/schema";
import type { H3Event } from "h3";

type Question = typeof questionsTable.$inferInsert;
type Option = typeof optionsTable.$inferInsert;

export async function useQuestionsService(event?: H3Event) {
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

  async function createQuestions(
    questions: (Question & { options?: Option[] })[]
  ) {
    const db = useDb();
    const questionsWithOptions: (Question & { options?: Option[] })[] = [];
    const qs = await db.insert(questionsTable).values(questions).returning();

    const optionsToStore = questions
      .map((q) =>
        q.options?.map((o) => ({
          ...o,
          questionId: qs.find((qsq) => qsq.question === q.question)?.id,
        }))
      )
      .flat()
      .filter((o) => o) as Option[];

    console.log(optionsToStore);

    const options = await db
      .insert(optionsTable)
      .values(optionsToStore)
      .returning();

    // Add options to the questions
    qs.forEach((q) => {
      questionsWithOptions.push({
        ...q,
        options: options.filter((o) => o.questionId === q.id),
      });
    });

    return questionsWithOptions;
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
