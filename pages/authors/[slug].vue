<template>
  <div v-if="authorData" class="px-4 py-8 mx-auto max-w-4xl">
    <div class="flex gap-6 items-start">
      <!-- Author Avatar -->
      <NuxtImg
        :src="authorData.avatar"
        :alt="authorData.name"
        class="object-cover w-32 h-32 rounded-full"
        width="128"
        height="128"
      />

      <div>
        <h1 class="mb-4 text-3xl font-bold">{{ authorData.name }}</h1>
        <p class="mb-6 text-gray-600 dark:text-gray-300">
          {{ authorData.bio }}
        </p>
      </div>
    </div>

    <!-- Author's Posts -->
    <div class="mt-12">
      <h2 class="mb-6 text-2xl font-semibold">
        Articles by {{ authorData.name }}
      </h2>
      <BlogPostsList :posts="authorPosts" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const authorSlug = route.params.slug as string;

// Fetch author data
const { data: authorData } = await useAsyncData("author", () =>
  queryContent<ContentAuthor>("authors")
    .where({ _path: `/authors/${authorSlug}` })
    .findOne()
);

// Fetch all posts by this author
const { data: authorPosts } = await useAsyncData("authorPosts", () =>
  queryContent<ContentPost>("blog")
    .where({ author: authorSlug })
    .sort({ date: -1 })
    .find()
);
</script>
