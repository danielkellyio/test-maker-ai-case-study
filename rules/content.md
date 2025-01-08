Apply the following rules when working with content stored in the content directory for use with Nuxt Content:

- Remember the content doesn't have an id, instead they have a `_path` property
- We must create custom types for the front matter

  - Create these custom types in `types/content.d.ts` like this:

  ```typescript
  import type { MarkdownParsedContent } from "@nuxt/content";

  declare global {
    interface ContentPost extends MarkdownParsedContent {
      title: string;
      date: string;
      author: string;
      tags: string[];
    }

    // other types for the content directory go here
  }
  ```

  - Then when using the queryContent function from Nuxt content we must pass the CustomType like this:

```
 queryContent<ContentPost>('blog').findOne()
```
