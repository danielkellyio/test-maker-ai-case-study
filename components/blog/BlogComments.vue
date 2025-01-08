<template>
  <div class="space-y-6">
    <BlogCommentsList :comments="comments" />
    <BlogCommentsLogin v-if="!loggedIn" />
    <BlogCommentsForm v-else @submit="submitComment" />
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();

const props = defineProps<{
  path: string;
}>();

const comments = ref([]);

// Fetch comments
const fetchComments = async () => {
  comments.value = await $fetch(`/api/comments/${props.path}`);
};

// Submit comment
const submitComment = async (formData: { content: string }) => {
  if (!formData.content.trim()) return;

  const newComment = await $fetch(`/api/comments/${props.path}`, {
    method: "POST",
    body: {
      content: formData.content.trim(),
    },
  });

  comments.value.push(newComment);
};

// Initial fetch
onMounted(fetchComments);
</script>
