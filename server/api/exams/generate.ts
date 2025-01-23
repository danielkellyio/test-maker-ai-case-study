import { z } from "zod";

export default defineApiEventHandler({
  validation: z.object({
    examId: z.string().uuid(),
    numberOfQuestions: z.coerce.number().optional().default(10),
  }),
  async handler(event, payload) {
    // Get the anthropic service to generate the exam
    const { generateExam } = useAnthropicService();
    const { createQuestions } = useQuestionsService();

    try {
      // Get the exam from the database and generate test content
      const generatedExam = {
        questions: [
          {
            type: "multiple-choice",
            question:
              "What was Philoponus's view on how mediums affect projectile motion?",
            options: [
              {
                option: "The medium hinders the projectile's motion",
                isCorrect: 1,
                explanation:
                  "Philoponus correctly understood that mediums like air and water resist motion rather than assist it",
              },
              {
                option: "The medium pushes the projectile forward",
                isCorrect: 0,
                explanation:
                  "This was Aristotle's incorrect view, not Philoponus's",
              },
              {
                option: "The medium has no effect on the projectile",
                isCorrect: 0,
                explanation:
                  "Philoponus recognized that mediums do affect projectile motion",
              },
              {
                option: "The medium only affects heavy objects",
                isCorrect: 0,
                explanation: "This was not Philoponus's view on medium effects",
              },
            ],
          },
          {
            type: "true-false",
            question:
              "According to the text, dolphins can swim at speeds up to 35 kilometers per hour.",
            answer: "true",
            explanation:
              "The text specifically states that scientists have observed dolphins swimming at speeds up to 35 kilometers per hour (22 miles per hour)",
          },
          {
            type: "fill-in-the-blank",
            question:
              "A(n) _____ is an object that travels through the air without its own source of power.",
            answer: "projectile",
            alternateAnswers: ["projectiles"],
            explanation:
              "A projectile is defined as an object launched that travels through the air without its own power source",
          },
          {
            type: "multiple-choice",
            question: "What features help dolphins reduce water drag?",
            options: [
              {
                option: "Special skin ridges and tiny skin vibrations",
                isCorrect: 1,
                explanation:
                  "The text mentions both skin ridges and tiny vibrations as features that help reduce water drag",
              },
              {
                option: "Rough scales and tail movement",
                isCorrect: 0,
                explanation: "These features are not mentioned in the text",
              },
              {
                option: "Large fins and smooth skin",
                isCorrect: 0,
                explanation:
                  "These are not the features mentioned that help reduce water drag",
              },
              {
                option: "Gills and streamlined body",
                isCorrect: 0,
                explanation:
                  "Dolphins don't have gills, and while body shape is mentioned, it's not paired with gills",
              },
            ],
          },
          {
            type: "essay",
            question:
              "Compare and contrast Aristotle's and Philoponus's views on projectile motion. Use specific examples from the text to support your answer.",
          },
          {
            type: "multiple-choice",
            question:
              "What was the primary reason John Philoponus disagreed with Aristotle about falling objects?",
            options: [
              {
                option:
                  "His experiments showed the speed difference was smaller than Aristotle claimed",
                isCorrect: 1,
                explanation:
                  "Philoponus found through experimentation that while heavier objects fell slightly faster, the difference wasn't as large as Aristotle suggested",
              },
              {
                option:
                  "He believed all objects fell at exactly the same speed",
                isCorrect: 0,
                explanation:
                  "Philoponus actually acknowledged some weight difference in falling speeds",
              },
              {
                option: "He thought lighter objects fell faster",
                isCorrect: 0,
                explanation:
                  "This contradicts what the text states about Philoponus's findings",
              },
            ],
          },
          {
            type: "true-false",
            question:
              "According to Aristotle, objects need a continuous force to remain in motion.",
            answer: "true",
            explanation:
              "Aristotle believed objects 'wanted' to be at rest and needed continuous pushing or pulling to move",
          },
          {
            type: "fill-in-the-blank",
            question:
              "The _____ on a dolphin's skin help reduce water drag when swimming.",
            answer: "ridges",
            alternateAnswers: ["ridge", "skin ridges"],
            explanation:
              "Dolphins have ridges arranged in a way that helps water flow more smoothly across their skin",
          },
          {
            type: "multiple-choice",
            question:
              "What did Aristotle believe happened to air when an arrow flew through it?",
            options: [
              {
                option:
                  "It moved to the back of the arrow and pushed it forward",
                isCorrect: 1,
                explanation:
                  "Aristotle thought the air pushed aside by the arrow moved to its back and propelled it forward",
              },
              {
                option: "It created resistance against the arrow",
                isCorrect: 0,
                explanation:
                  "This was Philoponus's correct view, not Aristotle's",
              },
              {
                option: "It had no effect on the arrow",
                isCorrect: 0,
                explanation:
                  "Aristotle believed the air played an active role in projectile motion",
              },
            ],
          },
          {
            type: "essay",
            question:
              "Explain how the experiment with the pebble in air and water helps demonstrate why Philoponus's view of projectile motion was more accurate than Aristotle's.",
          },
          {
            type: "multiple-choice",
            question:
              "According to the text, what role does a medium play in projectile motion?",
            options: [
              {
                option: "It slows down the projectile",
                isCorrect: 1,
                explanation:
                  "Philoponus correctly observed that mediums like air and water resist motion and slow projectiles down",
              },
              {
                option: "It pushes the projectile forward",
                isCorrect: 0,
                explanation: "This was Aristotle's incorrect view",
              },
              {
                option: "It has no effect on the projectile",
                isCorrect: 0,
                explanation:
                  "Mediums definitely affect projectile motion through resistance",
              },
            ],
          },
          {
            type: "true-false",
            question:
              "Scientists completely understand how dolphins reduce water drag when swimming.",
            answer: "false",
            explanation:
              "The text explicitly states that scientists haven't completely figured out all the details of how dolphins reduce water drag",
          },
          {
            type: "fill-in-the-blank",
            question:
              "Dolphins can swim at speeds up to _____ kilometers per hour.",
            answer: "35",
            alternateAnswers: ["thirty-five"],
            explanation:
              "The text states that dolphins can swim at speeds up to 35 kilometers per hour",
          },
          {
            type: "essay",
            question:
              "Describe three specific adaptations that help dolphins swim efficiently through water and explain how each one helps reduce water drag.",
          },
          {
            type: "multiple-choice",
            question:
              "Which statement best describes Philoponus's approach to Aristotle's teachings?",
            options: [
              {
                option:
                  "He respected Aristotle's work but was willing to challenge incorrect ideas",
                isCorrect: 1,
                explanation:
                  "The text states that Philoponus recognized Aristotle's great work but disagreed when he thought Aristotle was wrong",
              },
              {
                option: "He completely rejected all of Aristotle's teachings",
                isCorrect: 0,
                explanation:
                  "This is too extreme - he respected some of Aristotle's work",
              },
              {
                option:
                  "He accepted everything Aristotle taught without question",
                isCorrect: 0,
                explanation:
                  "Unlike many others, he was willing to challenge Aristotle's ideas",
              },
            ],
          },
          {
            type: "true-false",
            question:
              "According to the text, water provides more resistance to projectile motion than air.",
            answer: "true",
            explanation:
              "The experiment showed that projectiles travel much less distance in water than in air due to greater resistance",
          },
          {
            type: "fill-in-the-blank",
            question:
              "The tiny _____ of a dolphin's skin while swimming may help reduce water drag.",
            answer: "vibrations",
            alternateAnswers: ["vibration"],
            explanation:
              "The text mentions that dolphins' skin vibrates with very tiny vibrations while swimming",
          },
          {
            type: "multiple-choice",
            question:
              "What did the experiment with the pebble and rubber band demonstrate?",
            options: [
              {
                option: "Mediums resist projectile motion",
                isCorrect: 1,
                explanation:
                  "The pebble traveled less distance in water than in air, showing that mediums resist motion",
              },
              {
                option: "Heavier objects fall faster",
                isCorrect: 0,
                explanation:
                  "This wasn't demonstrated by the rubber band experiment",
              },
              {
                option: "Air pushes projectiles forward",
                isCorrect: 0,
                explanation: "The experiment disproved this idea",
              },
            ],
          },
          {
            type: "true-false",
            question:
              "Aristotle believed that objects naturally want to be in motion.",
            answer: "false",
            explanation:
              "According to the text, Aristotle believed objects 'wanted' to be at rest",
          },
          {
            type: "essay",
            question:
              "Evaluate the historical significance of Philoponus challenging Aristotle's ideas about motion. How did his willingness to question established beliefs contribute to the development of scientific understanding?",
          },
        ],
      };

      // Create the questions in the database
      const questions = await createQuestions(
        generatedExam.questions.map((question) => {
          return {
            ...question,
            examId: payload.examId,
          };
        })
      );

      return questions;
    } catch (error) {
      console.error("Error generating exam:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to generate exam",
      });
    }
  },
});
