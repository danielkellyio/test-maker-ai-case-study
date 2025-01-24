// Define the API endpoint for listing all exams
export default defineApiEventHandler({
  guards: [userIsAuthenticatedGuard],
  async handler(event) {
    const { getExams } = await useExamsService(event);

    return getExams();
  },
});
