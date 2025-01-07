<script setup lang="ts">
interface Author {
  name: string;
  bio: string;
  avatar?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

const props = defineProps<{
  authorSlug: string;
}>();

const { data: author } = await useAsyncData<Author>(
  `author-${props.authorSlug}`,
  () =>
    queryContent("authors")
      .where({ _path: `/authors/${props.authorSlug}` })
      .findOne()
);
</script>

<template>
  <div
    v-if="author"
    class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
  >
    <img
      :src="author.avatar"
      :alt="author.name"
      class="w-16 h-16 rounded-full"
    />
    <div>
      <h3 class="text-lg font-semibold dark:text-white">{{ author.name }}</h3>
      <p class="text-gray-600 dark:text-gray-300">{{ author.bio }}</p>
      <div class="flex gap-4 mt-2">
        <a
          v-if="author.twitter"
          :href="`https://twitter.com/${author.twitter}`"
          class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a
          v-if="author.github"
          :href="`https://github.com/${author.github}`"
          class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          v-if="author.website"
          :href="author.website"
          class="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>
      </div>
    </div>
  </div>
</template>
