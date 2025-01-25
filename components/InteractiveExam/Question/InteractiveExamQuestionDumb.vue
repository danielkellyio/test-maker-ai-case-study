<script setup lang="ts">
import type { ComponentQuestion } from "./types";

interface Props {
  question: ComponentQuestion;
  modelValue: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
});
const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const isFillInTheBlank = computed(
  () => props.question.type === "fill-in-the-blank"
);

// Compute a friendly label for the question type badge
const questionTypeBadge = computed(() => {
  switch (props.question.type) {
    case "multiple-choice":
      return "Multiple Choice";
    case "true-false":
      return "True/False";
    case "fill-in-the-blank":
      return "Fill in the Blank";
    case "essay":
      return "Essay";
    default:
      return props.question.type;
  }
});
</script>

<template>
  <div class="p-6 rounded-lg border shadow-sm bg-card text-card-foreground">
    <Badge class="mb-2" variant="secondary">{{ questionTypeBadge }}</Badge>
    <h3 v-if="!isFillInTheBlank" class="mb-4 text-lg font-medium">
      {{ question.question }}
    </h3>
    <div v-else class="mb-4"></div>

    <div class="space-y-4">
      <!-- Multiple Choice -->
      <InteractiveExamQuestionMultipleChoiceDumb
        v-if="question.type === 'multiple-choice'"
        :question="question"
        :model-value="modelValue as string[]"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <!-- True/False -->
      <InteractiveExamQuestionTrueFalseDumb
        v-else-if="question.type === 'true-false'"
        :question="question"
        :model-value="modelValue as string"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <!-- Fill in the blank -->
      <InteractiveExamQuestionFillInTheBlankDumb
        v-else-if="question.type === 'fill-in-the-blank'"
        :question="question"
        :model-value="modelValue as string"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <!-- Essay -->
      <InteractiveExamQuestionEssayDumb
        v-else-if="question.type === 'essay'"
        :question="question"
        :model-value="modelValue as string"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>
