import { examsTable, scannedPagesTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export type Exam = typeof examsTable.$inferInsert;
export function useExamsService() {
  const db = useDb();

  async function createExam(exam: Partial<Exam>) {
    const exams = await db.insert(examsTable).values(exam).returning();
    return exams.at(0);
  }

  function getExam(examId: string) {
    return db.query.examsTable.findFirst({
      where: eq(examsTable.id, examId),
    });
  }

  async function getExamWithScannedPages(examId: string) {
    const exams = await db.query.examsTable.findFirst({
      where: eq(examsTable.id, examId),
      with: {
        scannedPages: true,
      },
    });
    return exams;
  }

  async function updateExam(examId: string, exam: Partial<Exam>) {
    const exams = await db
      .update(examsTable)
      .set(exam)
      .where(eq(examsTable.id, examId))
      .returning();
    return exams.at(0);
  }

  async function deleteExam(examId: string) {
    const exams = await db.delete(examsTable).where(eq(examsTable.id, examId));
    return exams.at(0);
  }

  return {
    createExam,
    getExam,
    updateExam,
    deleteExam,
    getExamWithScannedPages,
  };
}
