import type { scannedPagesTable } from "~/server/db/schema";
import { examsTable, questionsTable } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { H3Event } from "h3";
export type Exam = typeof examsTable.$inferSelect;

export async function useExamsService(event?: H3Event) {
  const db = useDb(event);
  const { user } = await useUserService(event);

  async function createExam(exam: Partial<Exam>) {
    const exams = await db
      .insert(examsTable)
      .values({ ...exam, createdBy: user?.id })
      .returning();
    return exams.at(0);
  }

  function getExam(examId: string) {
    return db.query.examsTable.findFirst({
      where: and(eq(examsTable.id, examId), eq(examsTable.createdBy, user?.id)),
    });
  }

  async function getExamWithScannedPages(examId: string): Promise<
    | (Exam & {
        questionsCount: number;
        scannedPages: (typeof scannedPagesTable.$inferSelect)[];
      })
    | undefined
  > {
    const exams = await db.query.examsTable.findFirst({
      where: and(eq(examsTable.id, examId), eq(examsTable.createdBy, user?.id)),
      with: {
        scannedPages: true,
      },
      extras: {
        questionsCount: sql<number>`(
          SELECT cast(count(*) as int)
          FROM questions
          WHERE questions."examId"= ${examId}
        )`.as("questions_count"),
      },
    });
    return exams;
  }

  async function getExamWithQuestions(examId: string) {
    const exams = await db.query.examsTable.findFirst({
      where: and(eq(examsTable.id, examId), eq(examsTable.createdBy, user?.id)),
      with: {
        questions: {
          with: {
            options: true,
          },
        },
      },
    });
    return exams;
  }

  async function updateExam(examId: string, exam: Partial<Exam>) {
    const exams = await db
      .update(examsTable)
      .set(exam)
      .where(and(eq(examsTable.id, examId), eq(examsTable.createdBy, user?.id)))
      .returning();
    return exams.at(0);
  }

  async function deleteExam(examId: string) {
    const exams = await db
      .delete(examsTable)
      .where(
        and(eq(examsTable.id, examId), eq(examsTable.createdBy, user?.id))
      );
    return exams.at(0);
  }

  async function deleteExamQuestions(examId: string) {
    const questions = await db
      .delete(questionsTable)
      .where(eq(questionsTable.examId, examId));
    return questions;
  }

  async function getExams() {
    console.log("getExams", user?.id);
    return db.query.examsTable.findMany({
      where(fields, { eq }) {
        return eq(fields.createdBy, user?.id);
      },
    });
  }

  return {
    createExam,
    getExam,
    updateExam,
    deleteExam,
    getExamWithScannedPages,
    getExamWithQuestions,
    getExams,
    deleteExamQuestions,
  };
}
