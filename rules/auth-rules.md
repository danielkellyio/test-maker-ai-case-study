The following rules are helpful when working with the auth:

# Vue Composable

Nuxt Auth Utils automatically adds some plugins to fetch the current user session to let you access it from your Vue components.

## User Session

```vue
<script setup>
const { loggedIn, user, session, fetch, clear } = useUserSession();
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user.login }}!</h1>
    <p>Logged in since {{ session.loggedInAt }}</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/auth/github">Login with GitHub</a>
  </div>
</template>
```

## TypeScript Signature:

```typescript
interface UserSessionComposable {
  /**
   * Computed indicating if the auth session is ready
   */
  ready: ComputedRef<boolean>;
  /**
   * Computed indicating if the user is logged in.
   */
  loggedIn: ComputedRef<boolean>;
  /**
   * The user object if logged in, null otherwise.
   */
  user: ComputedRef<User | null>;
  /**
   * The session object.
   */
  session: Ref<UserSession>;
  /**
   * Fetch the user session from the server.
   */
  fetch: () => Promise<void>;
  /**
   * Clear the user session and remove the session cookie.
   */
  clear: () => Promise<void>;
}
```

Important
Nuxt Auth Utils uses the /api/\_auth/session route for session management. Ensure your API route middleware doesn't interfere with this path.

# Server Utils

The following helpers are auto-imported in your server/ directory.

## Session Management

```typescript
// Set a user session, note that this data is encrypted in the cookie but can be decrypted with an API call
// Only store the data that allow you to recognize a user, but do not store sensitive data
// Merges new data with existing data using unjs/defu library
await setUserSession(event, {
  // User data
  user: {
    login: "atinux",
  },
  // Private data accessible only on server/ routes
  secure: {
    apiToken: "1234567890",
  },
  // Any extra fields for the session data
  loggedInAt: new Date(),
});

// Replace a user session. Same behaviour as setUserSession, except it does not merge data with existing data
await replaceUserSession(event, data);

// Get the current user session
const session = await getUserSession(event);

// Clear the current user session
await clearUserSession(event);

// Require a user session (send back 401 if no `user` key in session)
const session = await requireUserSession(event);
```
