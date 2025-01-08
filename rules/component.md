When adding new Vue components, always:

- break components down into smaller, more focused components
- make most components "dumb" components. These focus on:
  - presentation
  - simple logic
- limit "smart" components that make requests to API endpoints to only what's absolutely necessary
- break complex logic into composables or utility functions
- Always use TypeScript to define all components.
- Use Typescript to define component props and emits.
- use JS docs to document component props and emits
- Use script setup
- Provide the component sections in the following order:
  - script
  - template
  - style
- Use the built in Nuxt $fetch function instead of browser native fetch when reacting to user events and in lifecylcle hooks (except setup). Basically, anything that only runs in the browser (in the client) should use $fetch
- Any code that runs at the root level of script setup, should make https requests with useFetch or useAsyncData. Prefer useFetch when possible.
- Example of when to use $fetch vs useFetch:

```
<script setup lang="ts">
  const { data: users } = await useFetch("/api/users");
  async function createUser(newUser: User){
   const newUser = await $fetch('/api/users', {
       method: 'POST',
       body: newUser
   })
  }
```

-Components are named and auto imported based on their location within the components directory. For example:

- A component stored in `@/components/MyComponent` will be named MyComponent.
- A component stored in `@/components/users/UsersMyComponent` will be named UsersMyComponent
- ALWAYS prefix the component name with any directory it's nested under within the components directory

- remind me to create a unit test for the component
  - for presentational components use snapshot tests
  - for any components with logic, test the props down/events up, and the necessary user interactions
