When adding new API endpoints, always:

- Use zod to validate the request body and response body
- use the zod request body schema to create a TypeScript type for use throughout the application
- use the zod response body schema to create a TypeScript type for use throughout the application
- extract database and other storage logic into a separate service and use the service in the API endpoint
- if data storage is required refer to the `rules/data-storage-rules.md` for more context
- define and/or use existing server utils that are defined in `server/utils/middleware` to apply route specific middleware. Such middleware should be functions that either throw a new error with createError and a relevant statusCode or return an aribtrary body. This middleware should also always be passed the validated payload
- create all CRUD methods as seperate files for example:
  - `[file-path]` | [method] | `[url]`
  - `server/api/posts/index.ts` | GET | `api/posts/`
  - `server/api/posts/index.post.ts` | POST | `api/posts/`
  - `server/api/posts/[id].put.ts` | PUT | `api/posts/[id]`
  - `server/api/posts/[id].delete.ts` | DELETE | `api/posts/[id]`
- at the end, remind me to create a test for the API endpoint
