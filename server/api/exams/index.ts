// Define the API endpoint for listing all exams
export default defineApiEventHandler({
  guards: [userIsAuthenticatedGuard],
  async handler(event) {
    // Get database instance
    const db = useDb();
    const { getExams } = useExamsService();

    return getExams();
  },
});
