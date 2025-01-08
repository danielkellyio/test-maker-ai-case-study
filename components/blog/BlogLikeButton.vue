<script setup lang="ts">
import confetti from "canvas-confetti";

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

const buttonRef = ref<HTMLButtonElement>();

const triggerConfetti = () => {
  if (!buttonRef.value) return;

  // Get button position
  const rect = buttonRef.value.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 60,
    spread: 50,
    origin: { x, y },
    colors: ["#ec4899", "#f472b6", "#fbcfe8"],
    angle: 90,
    startVelocity: 20,
    gravity: 1.2,
    scalar: 0.7,
  });
};

// Handle like toggle
const toggleLike = async () => {
  if (!loggedIn.value) return;

  isLoading.value = true;
  try {
    const response = await $fetch<{ likes: string[]; isLiked: boolean }>(
      `/api/posts/${postId.value}/likes/toggle`,
      { method: "POST" }
    );

    // Only trigger confetti if the post was not previously liked
    if (response.likes.includes(user.value?.id || "")) {
      triggerConfetti();
    }

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
    ref="buttonRef"
    :disabled="!loggedIn || isLoading"
    :title="!loggedIn ? 'Please log in to like posts' : ''"
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
