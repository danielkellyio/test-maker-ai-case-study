import { defineCollection, z } from "@nuxt/content/config";

export const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(), // This will reference the author's file name (e.g., "john-doe")
    image: z.string(),
    tags: z.array(z.string()),
  }),
});
