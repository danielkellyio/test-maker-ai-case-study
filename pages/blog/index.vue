<template>
  <div>
    <h2 class="text-3xl font-semibold mb-6">Blog Posts</h2>
    <div class="grid gap-6">
      <article
        v-for="post in posts"
        :key="post._path"
        class="p-6 bg-white rounded-lg shadow"
      >
        <NuxtLink :to="post._path">
          <h3 class="text-xl font-semibold mb-2">{{ post.title }}</h3>
          <p class="text-gray-600">{{ post.description }}</p>
          <div class="mt-4 text-sm text-gray-500">
            {{ new Date(post.date).toLocaleDateString() }}
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData("posts", () =>
  queryContent("/blog").sort({ date: -1 }).find()
);
</script>
