<script setup lang="ts">
import type { ComponentQuestion } from "./types";
import { computed } from "vue";

interface Props {
  question: ComponentQuestion;
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Decode the JSON string to an array, with fallback to empty array
const answers = computed(() => {
  try {
    return JSON.parse(props.modelValue || "[]");
  } catch {
    return [];
  }
});

// Split the question text at the placeholder and get all parts
const parts = computed(() => props.question.question.split("_____"));

// Update a specific blank's value
function updateBlank(index: number, value: string) {
  const newValues = [...answers.value];
  newValues[index] = value;
  emit("update:modelValue", JSON.stringify(newValues));
}
</script>

<template>
  <div class="flex flex-wrap gap-1 items-center">
    <!-- Render each part with an input field after it (except the last part) -->
    <template v-for="(part, index) in parts" :key="index">
      <span>{{ part }}</span>

      <!-- Add input field after each part except the last one -->
      <input
        v-if="index < parts.length - 1"
        type="text"
        :value="answers[index] ?? ''"
        class="px-1 py-0 w-auto min-w-[120px] bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none text-center"
        @input="e => updateBlank(index, (e.target as HTMLInputElement).value)"
      />
    </template>
  </div>
</template>
