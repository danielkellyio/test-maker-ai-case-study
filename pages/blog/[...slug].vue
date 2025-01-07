<template>
  <article class="max-w-4xl mx-auto px-4 py-8">
    <BlogHeader :title="data?.title" :author="authorData" :date="data?.date" />

    <!-- Main Content -->
    <BlogContent :content="data" />

    <!-- Tags Section -->
    <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="flex gap-2">
        <span class="text-gray-600 dark:text-gray-400">Tags:</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in data?.tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <BlogAuthor :author-slug="data?.author" />
    </div>

    <!-- Comments Section -->
    <div class="mt-12">
      <BlogComments :path="data?._path || ''" />
    </div>
  </article>
</template>

<script setup lang="ts">
interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

interface BlogPost {
  title: string;
  date: string;
  author: string;
  tags: string[];
  _path: string;
  // ... other blog post fields
}

const { path } = useRoute();
const { data } = await useAsyncData<BlogPost>("post", () =>
  queryContent(path).findOne()
);

// Fetch author data
const { data: authorData } = await useAsyncData<Author>("author", async () => {
  if (!data.value?.author) return null;
  return queryContent("authors")
    .where({ _path: `/authors/${data.value.author}` })
    .findOne();
});
</script>
