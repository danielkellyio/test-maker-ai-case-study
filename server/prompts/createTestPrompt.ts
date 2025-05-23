import type {
  examsTable,
  scannedPagesTable,
  questionsTable,
} from "../db/schema";

// Example exam data structure optimized for LLM training
// This demonstrates various question types and best practices for exam creation
const examTemplateForLLM = {
  questions: [
    {
      type: "multiple-choice",
      question: "What is 2 + 2 ?", // Clear, direct question
      // Multiple choice should have 3-5 plausible options
      // and 1 or more correct answers (prefer 1 correct answer most of the time)
      options: [
        {
          option: "4", // Correct answer
          isCorrect: 1,
          explanation: "2 + 2 = 4", // Optional explanation for feedback
        },
        {
          option: "3", // Plausible distractor
          isCorrect: 0,
          explanation: "3 + 2 = 5",
        },
        {
          option: "1", // Plausible distractor
          isCorrect: 0,
          explanation: "1 + 2 = 3",
        },
      ],
    },
    {
      type: "true-false",
      question: "2 + 2 = 4", // Be specific in true/false questions
      answer: "true",
      explanation: "2 + 2 = 4",
    },
    {
      type: "fill-in-the-blank",
      question: "The _____ of 2 and 2 is 4", // Use _____ to indicate the blank
      answer: ["sum"], // Use an array of strings to indicate the answer as there may be multiple blanks. Even if there is only one blank, it should be an array.
      alternateAnswers: [["sum"], ["addition"]],
      explanation: "The sum of 2 and 2 is 4",
    },
    {
      type: "essay",
      question: "How can addition be used to solve problems?", // Clear prompt with specific requirements
    },
  ],
} as const;

export type LLMExamResponse = {
  numberOfQuestionsCreated: number;
  questions: Omit<typeof questionsTable.$inferInsert, "id">[];
};

interface CreateTestPromptOptions {
  numberOfQuestions?: number;
}

export const createTestPrompt = (
  exam: typeof examsTable.$inferSelect & {
    scannedPages: (typeof scannedPagesTable.$inferSelect)[];
  },
  questions: (typeof questionsTable.$inferSelect)[],
  { numberOfQuestions = 10 }: CreateTestPromptOptions
) => {
  return `
<generalInstructions>
You are an expert school exam creator. 
You are given the content of pages within a textbook. 
You are tasked with creating an exam based on the content of the pages.
You should create an exam that is diverse and includes a variety of question types. 
You should also create an exam that is appropriate for the grade level of the page content.
The exam might already have some questions in it, but you should create some new unique questions to add to the exam.

The <exampleExam> below is an example of an exam that you should follow the format of.
DO NOT sampe the question content from the example exam, ONLY THE STRUCTURE.
</generalInstructions>

<exampleExam>
    ${JSON.stringify(examTemplateForLLM)}
</exampleExam>



<examInfo>
    <examName>${exam.name}</examName>
    <examDescription>${exam.description}</examDescription>
    <numberOfQuestions>${numberOfQuestions}</numberOfQuestions>
    <numberOfQuestionsPerPage>${
      numberOfQuestions / exam.scannedPages.length
    } plus or minus 3</numberOfQuestionsPerPage>
</examInfo>

<existingQuestions>
${questions
  .map((question) => `<question>${question.question}</question>`)
  .join("\n")}
</existingQuestions>



<textBookPages>
${exam.scannedPages
  .map((page) => `<page id="${page.id}">${page.pageText}</page>`)
  .join("\n")}
</textBookPages>

<returnInstructions>
Return ONLY a JSON object that matches the structure in the example.
DO NOT RETURN ANYTHING ELSE.
ONLY RETURN THE JSON OBJECT as a raw string, no other text or formatting.
If you are unable to create ${numberOfQuestions} questions, you MUST return the following additional properties in the returned object:

{
    "numberOfQuestionsCreated": <number>
}
</returnInstructions>`;
};
