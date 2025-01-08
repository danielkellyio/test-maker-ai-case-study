<template>
  <article v-if="postData" class="px-4 py-8 mx-auto max-w-4xl">
    <BlogHeader
      :title="postData?.title"
      :author="authorData"
      :date="postData?.date"
    />

    <!-- Main Content -->
    <BlogContent :content="postData" />

    <!-- Like Button -->
    <div class="mt-8">
      <BlogLikeButton :post-path="postData?._path || ''" />
    </div>

    <!-- Tags Section -->
    <div class="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="flex gap-2">
        <span class="text-gray-600 dark:text-gray-400">Tags:</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in postData?.tags"
            :key="tag"
            class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-gray-300"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <BlogAuthor :author-slug="postData?.author" />
    </div>

    <!-- Comments Section -->
    <div class="mt-12">
      <BlogComments :path="postData?._path || ''" />
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
const { data: postData } = await useAsyncData("post", () =>
  queryContent<BlogPost>(path).findOne()
);

// Fetch author data
const { data: authorData } = await useAsyncData("author", async () => {
  if (!postData.value?.author) return null;
  return queryContent<Author>("authors")
    .where({ _path: `/authors/${postData.value.author}` })
    .findOne();
});
</script>
