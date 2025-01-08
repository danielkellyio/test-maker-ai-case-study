When adding new API endpoints, always:

- define an API endpoint as in this example:

```
import { z } from "zod";
export default defineApiEventHandler({
  validation: z.object({
    name: z.string(),
    age: z.coerce.number().optional(),
  }),
  handler(event, payload) {
    return payload;
  },
});
```

- Use zod to validate the request payload (this includes query variables, JSON body, and route params all spread into a single object)
- extract database and other storage logic into a separate service and use the service in the API endpoint
- all server-side services should live in `@/server/utils/services` so that they are auto-imported. They should also all be exported from `@/server/utils/services/index.ts`
- For example:

  ```
  // @/server/helpers/services/likes.service.ts
  export const useLikeService(){}

  // @/server/helper/services/index.ts
  export * from "./likes.service.ts"

  ```

- if you need to interact with a database or persist any kind of data within the API endpoint then refer to the `rules/data-storage-rules.md` for more context. If `rules/data-storage-rules.md` is not part of the context already STOP EVERYTHING and ask me to add it to the context.
- define and/or use existing server utils that are defined in `server/utils/guards` to apply route specific middleware/guards. Such middleware/guards should be functions that either throw a new error with createError and a relevant statusCode or return an aribtrary body. This middleware should also always be passed the validated payload
- create all CRUD methods for an API as seperate files. For example:
  - `[file-path]` | [method] | `[url]`
  - `server/api/posts/index.ts` | GET | `api/posts/`
  - `server/api/posts/index.post.ts` | POST | `api/posts/`
  - `server/api/posts/[id].put.ts` | PUT | `api/posts/[id]`
  - `server/api/posts/[id].delete.ts` | DELETE | `api/posts/[id]`
- NEVER handle different request methods for an API endpoint in the same file.
- at the end, remind me to create a test for the API endpoint
