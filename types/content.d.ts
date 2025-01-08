import type { MarkdownParsedContent } from "@nuxt/content";

declare global {
  // Types for the content directory go here
  interface ContentPost extends MarkdownParsedContent {
    title: string;
    date: string;
    author: string;
    tags: string[];
  }
}
