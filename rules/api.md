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

- Use zod to validate the request payload (this includes query variables, JSON body, and route params)
- extract database and other storage logic into a separate service and use the service in the API endpoint
- all server-side services should live in `@/server/utils/services` so that they are auto-imported
- if data storage is required refer to the `rules/data-storage-rules.md` for more context
- define and/or use existing server utils that are defined in `server/utils/guards` to apply route specific middleware/guards. Such middleware/guards should be functions that either throw a new error with createError and a relevant statusCode or return an aribtrary body. This middleware should also always be passed the validated payload
- create all CRUD methods as seperate files for example:
  - `[file-path]` | [method] | `[url]`
  - `server/api/posts/index.ts` | GET | `api/posts/`
  - `server/api/posts/index.post.ts` | POST | `api/posts/`
  - `server/api/posts/[id].put.ts` | PUT | `api/posts/[id]`
  - `server/api/posts/[id].delete.ts` | DELETE | `api/posts/[id]`
- at the end, remind me to create a test for the API endpoint
