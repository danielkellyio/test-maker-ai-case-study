<template>
  <div class="mt-12">
    <h3 class="mb-6 text-xl font-semibold">Comments</h3>
    <div class="space-y-6">
      <template v-if="comments.length > 0">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
        >
          <Avatar
            :src="comment.author.avatar"
            :alt="`${comment.author.name}'s avatar`"
            class="w-10 h-10"
          />
          <div>
            <div class="flex gap-2 items-center mb-1">
              <span class="font-medium">{{ comment.name }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(comment.createdAt) }}
              </span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </template>

      <div
        v-else
        class="p-8 text-center bg-gray-50 rounded-lg dark:bg-gray-800"
      >
        <p class="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: number;
  name: string;
  author: {
    name: string;
    avatar: string;
    githubUsername: string;
  };
  createdAt: string;
  content: string;
}

const props = defineProps<{
  comments: Comment[];
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
