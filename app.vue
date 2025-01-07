<template>
  <div class="min-h-screen dark:bg-gray-900 dark:text-white">
    <MainNav />
    <NuxtPage />
  </div>
</template>

<script setup>
// Using composition API
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* Ensure smooth transitions when switching themes */
.dark {
  color-scheme: dark;
}
</style>
