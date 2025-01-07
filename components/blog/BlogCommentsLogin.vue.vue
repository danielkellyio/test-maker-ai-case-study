<template>
  <div
    v-if="!loggedIn"
    class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
  >
    <p class="mb-4 text-gray-600 dark:text-gray-300">
      Please login to leave a comment
    </p>
    <a
      href="/auth/github"
      class="inline-flex items-center gap-2 px-4 py-2 text-white bg-gray-900 dark:bg-gray-700 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600"
    >
      <Icon name="mdi:github" class="w-5 h-5" />
      Login with GitHub
    </a>
  </div>
</template>
