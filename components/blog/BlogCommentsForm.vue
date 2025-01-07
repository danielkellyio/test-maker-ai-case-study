<template>
  <form @submit.prevent="handleSubmit" class="mt-8">
    <div class="space-y-4">
      <div>
        <label for="comment" class="block mb-1 text-lg font-semibold mb-6"
          >Leave a Comment</label
        >
        <textarea
          id="comment"
          v-model="formData.content"
          rows="4"
          required
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
        ></textarea>
      </div>
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit Comment
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface CommentFormData {
  name: string;
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
