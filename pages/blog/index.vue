<template>
  <div class="px-4 py-8 min-h-screen">
    <h2 class="mb-6 text-3xl font-semibold text-black dark:text-[#E0E0CE]">
      Blog Posts
    </h2>
    <BlogPostsList :posts="posts || []" />
  </div>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData("posts", () =>
  queryContent<ContentPost>("/blog").sort({ date: -1 }).find()
);
</script>
