import * as schema from "../db/schema";
import { seed } from "drizzle-seed";

export default defineTask({
  meta: {
    name: "seed",
    description: "Seed database users",
  },
  async run() {
    const tags = [
      "Math",
      "Science",
      "History",
      "English",
      "Art",
      "Music",
      "Sports",
      "Technology",
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Computer Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Geography",
      "Economics",
      "Finance",
      "Marketing",
      "Management",
      "Accounting",
      "Law",
      "Philosophy",
      "Psychology",
      "Sociology",
      "Anthropology",
      "History",
      "Literature",
      "Language",
      "Literature",
      "Language",
      "Literature",
      "Language",
      "Literature",
      "Language",
      "Literature",
      "Language",
    ];
    try {
      const db = useDb();
      const tables = Object.keys(schema);

      // delete all the existing data
      for (const table of tables) {
        // truncate the table
        await db.delete(schema[table as keyof typeof schema]);
      }

      const hashedPassword = await hashPassword("password");

      await seed(db, schema, {
        seed: 1,
      }).refine((f) => {
        return {
          examsTable: {
            count: 500,
            columns: {
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
            },
          },
          questionsTable: {
            count: 1000,
            columns: {
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
            },
          },
          optionsTable: {
            count: 1000,
            columns: {
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
            },
          },
          submissionsTable: {
            count: 1000,
            columns: {
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
            },
          },
          examTagsTable: {
            count: 1000,
            columns: {
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
            },
          },
          tagsTable: {
            count: tags.length,
            columns: {
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
              name: f.valuesFromArray({
                values: tags,
                isUnique: true,
              }),
            },
          },
          usersTable: {
            count: 1000,
            columns: {
              role: f.valuesFromArray({
                values: ["admin", "teacher", "student"],
              }),
              createdAt: f.timestamp(),
              updatedAt: f.timestamp(),
              id: f.uuid(),
              password: f.valuesFromArray({
                // hash the password
                values: [hashedPassword],
              }),
            },
          },
        };
      });

      return {
        message: "Seeded successfully",
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  },
});
