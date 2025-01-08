<template>
  <div class="grid gap-6">
    <div v-if="posts && posts.length > 0" class="grid grid-cols-4 gap-6">
      <article
        v-for="post in posts"
        :key="post._path"
        class="p-6 bg-white rounded-lg shadow transition-colors duration-200 dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <NuxtLink :to="post._path" class="block">
          <h3 class="mb-2 text-xl font-semibold text-black dark:text-gray-100">
            {{ post.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">{{ post.description }}</p>
          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {{ new Date(post.date).toLocaleDateString() }}
          </div>
        </NuxtLink>
      </article>
    </div>
    <div
      v-else
      class="p-8 text-center bg-white rounded-lg shadow dark:bg-gray-800"
    >
      <p class="text-gray-600 dark:text-gray-300">
        No blog posts available yet. Check back soon!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  posts: ContentPost[];
}

defineProps<Props>();
</script>
