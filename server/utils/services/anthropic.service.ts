import Anthropic from "@anthropic-ai/sdk";
import { createError } from "h3";
import {
  createTestPrompt,
  type LLMExamResponse,
} from "@/server/prompts/createTestPrompt";
import type { questionsTable } from "@/server/db/schema";
import type { H3Event } from "h3";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const useAnthropicService = async (event?: H3Event) => {
  /**
   * Extracts text content from an image using Claude Vision
   */
  const extractTextFromImage = async (imageBase64: string) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw createError({
        statusCode: 500,
        message: "Anthropic API key not configured",
      });
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
                  Please extract and return all the text content from this textbook page. Format it naturally, preserving paragraphs, headings, and any important structural elements. Output the text in a markdown format, to preserve structures like lists, tables, and headings, etc.
                  Return ONLY a JSON object with the following structure:
                  {
                    "pageNumber": "The page number of the textbook page if found as a string, otherwise null",
                    "text": "The extracted text content in markdown format. Escape all new lines and line breaks."
                  }
                  DO NOT RETURN ANYTHING ELSE.
                  ONLY RETURN THE JSON OBJECT as a raw string, no other text or formatting.
                  `,
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

      try {
        console.log(response.content[0].text);
        // @ts-expect-error - text does exist
        return JSON.parse(response.content[0].text) as {
          pageNumber: string | null;
          text: string;
        };
      } catch (error) {
        console.error("Error parsing JSON:", error);
        throw createError({
          statusCode: 500,
          message: "Failed to parse JSON from Claude",
        });
      }
    } catch (error) {
      console.error("Error processing image with Claude:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to process image with Claude",
      });
    }
  };

  async function generateExam(
    exam: Pick<Exam, "id">,
    {
      numberOfQuestions = 10,
      existingQuestions = [],
    }: {
      numberOfQuestions?: number;
      existingQuestions?: (typeof questionsTable.$inferSelect)[];
    }
  ): Promise<LLMExamResponse> {
    const { getExamWithScannedPages } = await useExamsService(event);

    if (!exam || !exam.id) {
      throw createError({
        statusCode: 400,
        message: "Exam ID is required",
      });
    }

    const examWithPages = await getExamWithScannedPages(exam.id);

    if (!examWithPages) {
      throw createError({
        statusCode: 400,
        message: "Exam with scanned pages not found",
      });
    }

    const prompt = createTestPrompt(examWithPages, existingQuestions, {
      numberOfQuestions,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    try {
      const parsedResponse = JSON.parse(
        // @ts-expect-error - text does exist
        response.content[0].text
      ) as LLMExamResponse;
      if (parsedResponse.numberOfQuestionsCreated < numberOfQuestions) {
        const moreQuestions = await generateExam(exam, {
          numberOfQuestions:
            numberOfQuestions - parsedResponse.numberOfQuestionsCreated,
          existingQuestions: [
            ...existingQuestions,
            ...parsedResponse.questions,
          ],
        });
        return {
          ...moreQuestions,
          questions: [...parsedResponse.questions, ...moreQuestions.questions],
        };
      }
      return parsedResponse;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to parse JSON from Claude",
      });
    }
  }

  return {
    extractTextFromImage,
    generateExam,
  };
};
