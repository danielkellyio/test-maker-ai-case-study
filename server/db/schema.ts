import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  role: text("role", { enum: ["admin", "teacher", "student"] }).default(
    "student"
  ),
});

export const scannedPagesTable = pgTable("scannedPages", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  examId: uuid("examId").references(() => examsTable.id, {
    onDelete: "cascade",
  }),
  pageNumber: text("pageNumber"),
  pageText: text("pageText"),
  pageImage: text("pageImage"),
  status: text("status", {
    enum: ["pending", "processing", "completed", "failed"],
  }).default("pending"),
});

export const examsTable = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  description: text("description"),
  createdBy: uuid("createdBy").references(() => usersTable.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const examsRelations = relations(examsTable, ({ many }) => ({
  scannedPages: many(scannedPagesTable),
}));

export const scannedPagesRelations = relations(
  scannedPagesTable,
  ({ one }) => ({
    exam: one(examsTable, {
      fields: [scannedPagesTable.examId],
      references: [examsTable.id],
    }),
  })
);

export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("examId").references(() => examsTable.id, {
    onDelete: "cascade",
  }),
  type: text("type", {
    enum: ["multiple-choice", "true-false", "fill-in-the-blank", "essay"],
  }),
  question: text("question"),
  answer: text("answer"), // ONLY for essay, true-false, and fill-in-the-blank NOT for multiple-choice
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  explanation: text("explanation"),
});

export const optionsTable = pgTable("options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("questionId").references(() => questionsTable.id, {
    onDelete: "cascade",
  }),
  option: text("option"),
  isCorrect: integer("isCorrect").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("examId").references(() => examsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  userId: uuid("userId").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});

export const tagsTable = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const examTagsTable = pgTable("examTags", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("examId").references(() => examsTable.id, {
    onDelete: "cascade",
  }),
  tagId: uuid("tagId").references(() => tagsTable.id, { onDelete: "cascade" }),
});
