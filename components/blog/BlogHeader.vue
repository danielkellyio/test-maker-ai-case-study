<template>
  <div class="mb-8">
    <nav class="text-sm mb-4">
      <NuxtLink
        to="/"
        class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        Home
      </NuxtLink>
      <span class="mx-2 text-gray-400">/</span>
      <NuxtLink
        to="/blog"
        class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        Blog
      </NuxtLink>
    </nav>
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      {{ title }}
    </h1>
    <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400">
      <div class="flex items-center gap-2">
        <Avatar :src="author?.avatar" :alt="author?.name" size="md" />
        <span>{{ author?.name }}</span>
      </div>
      <span>•</span>
      <time>{{ formatDate(date) }}</time>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  } | null;
  date: string;
}

const props = defineProps<Props>();

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
