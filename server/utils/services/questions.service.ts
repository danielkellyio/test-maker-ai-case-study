export default function useQuestionsService() {
  async function getQuestionsForExam(examId: string) {
    const db = useDb();
    return db.query.questionsTable.findMany({
      where: (questionsTable, { eq }) => eq(questionsTable.examId, examId),
    });
  }
  return {
    getQuestionsForExam,
  };
}
