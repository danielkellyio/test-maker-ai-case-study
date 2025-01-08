<script setup lang="ts">
interface Props {
  /**
   * The content path of the post to like/unlike
   */
  postPath: string;
}

interface Emits {
  (e: "update:likes", likes: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { loggedIn, user } = useUserSession();
const isLoading = ref(false);

const postId = computed(() => props.postPath.split("/").at(-1));

// Get initial likes
const { data: likes } = await useFetch<string[]>(
  `/api/posts/${postId.value}/likes`
);

// Computed property to check if current user has liked the post
const isLiked = computed(() => {
  if (!user.value?.id || !likes.value) return false;
  return likes.value.includes(user.value.id);
});

// Handle like toggle
const toggleLike = async () => {
  if (!loggedIn.value) return;

  isLoading.value = true;
  try {
    const response = await $fetch<{ likes: string[]; isLiked: boolean }>(
      `/api/posts/${postId.value}/likes/toggle`,
      { method: "POST" }
    );
    likes.value = response.likes;
    emit("update:likes", response.likes);
  } catch (error) {
    console.error("Error toggling like:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <button
    :disabled="!loggedIn || isLoading"
    class="inline-flex gap-2 items-center px-4 py-2 rounded-full transition-colors"
    :class="{
      'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300': isLiked,
      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300': !isLiked,
      'opacity-50 cursor-not-allowed': !loggedIn,
      'cursor-wait': isLoading,
    }"
    @click="toggleLike"
  >
    <Icon
      :name="isLiked ? 'ph:heart-fill' : 'ph:heart'"
      class="w-5 h-5"
      :class="{
        'text-pink-600 dark:text-pink-300': isLiked,
      }"
    />
    <span>{{ likes?.length || 0 }}</span>
  </button>
</template>
