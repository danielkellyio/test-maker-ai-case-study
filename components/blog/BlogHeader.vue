<template>
  <header class="mb-8">
    <h1 class="text-4xl font-bold mb-4">{{ title }}</h1>
    <div class="flex items-center gap-4">
      <NuxtLink
        v-if="author && authorPath"
        :to="authorPath"
        class="flex items-center gap-2 hover:text-primary-600"
      >
        <img
          :src="author.avatar"
          :alt="author.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span>{{ author.name }}</span>
      </NuxtLink>
      <time
        v-if="date"
        :datetime="date"
        class="text-gray-600 dark:text-gray-400"
      >
        {{ formatDate(date) }}
      </time>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
  author?: ContentAuthor;
  date?: string;
  authorPath?: string;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
