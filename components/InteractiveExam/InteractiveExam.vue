<script setup lang="ts">
import type { ComponentQuestion } from "./Question/types";

// Props and emits definition
interface Props {
  questions: ComponentQuestion[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "submit", answers: Record<string, string | string[]>): void;
}>();

// State management using composition API
const answers = ref<Record<string, string | string[]>>({});

// Initialize answers object with empty values
onMounted(() => {
  props.questions.forEach((question) => {
    answers.value[question.id] = question.type === "multiple-choice" ? [] : "";
  });
});

// Handle answer updates
const updateAnswer = (questionId: string, answer: string | string[]) => {
  answers.value[questionId] = answer;
};

// Handle form submission
const handleSubmit = () => {
  emit("submit", answers.value);
};

// Track completion status
const isComplete = computed(() => {
  return props.questions.every((question) => {
    const answer = answers.value[question.id];
    return answer !== "" && (!Array.isArray(answer) || answer.length > 0);
  });
});
</script>

<template>
  <!-- <div class="grid grid-cols-2"> -->
  <div>
    <form class="mb-10 space-y-8" @submit.prevent="handleSubmit">
      <div v-for="question in questions" :key="question.id" class="space-y-4">
        <InteractiveExamQuestionDumb
          :question="question"
          :model-value="answers[question.id]"
          @update:model-value="(val) => updateAnswer(question.id, val)"
        />
      </div>

      <div class="flex justify-end mt-8">
        <Button type="submit" :disabled="!isComplete" variant="outline">
          Submit Exam
        </Button>
      </div>
    </form>
    <!-- <pre>{{ answers }}</pre> -->
  </div>
</template>
