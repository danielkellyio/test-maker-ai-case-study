<template>
  <form class="mt-8" @submit.prevent="handleSubmit">
    <div class="space-y-4">
      <div>
        <label for="comment" class="block mb-6 text-lg font-semibold"
          >Leave a Comment</label
        >
        <textarea
          id="comment"
          v-model="formData.content"
          rows="4"
          required
          class="px-4 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
      <button
        type="submit"
        class="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
      >
        Submit Comment
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface CommentFormData {
  content: string;
}

const emit = defineEmits<{
  submit: [CommentFormData];
}>();

const formData = ref<CommentFormData>({
  content: "",
});

const handleSubmit = () => {
  emit("submit", { ...formData.value });
  formData.value = { content: "" };
};
</script>
