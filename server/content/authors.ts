import { defineCollection, z } from "@nuxt/content/config";

export const authors = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
});
