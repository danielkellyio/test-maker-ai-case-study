import type { optionsTable, questionsTable } from "~/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

// Use database types with extensions for component needs
type BaseOption = InferSelectModel<typeof optionsTable>;
type BaseQuestion = InferSelectModel<typeof questionsTable>;

// Make required fields non-nullable for component use
export type ComponentOption = Omit<BaseOption, "option" | "isCorrect"> & {
  option: string;
  isCorrect: number;
};

export type ComponentQuestion = Omit<
  BaseQuestion,
  "id" | "type" | "question"
> & {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-in-the-blank" | "essay";
  question: string;
  options?: ComponentOption[];
};
