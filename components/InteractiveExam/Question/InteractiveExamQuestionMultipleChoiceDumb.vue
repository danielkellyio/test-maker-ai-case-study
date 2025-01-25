<script setup lang="ts">
import type { ComponentOption, ComponentQuestion } from "./types";
import { computed } from "vue";

interface Props {
  question: ComponentQuestion;
  modelValue: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

// Generate letter labels for options (a, b, c, etc.)
const getLetterLabel = (index: number) => {
  return String.fromCharCode(97 + index); // 97 is ASCII for 'a'
};

// Compute whether this is a multiple answer question by checking if more than one option has isCorrect = 1
const isMultipleAnswer = computed(() => {
  if (!props.question.options) return false;
  return props.question.options.filter((opt) => opt.isCorrect === 1).length > 1;
});

// Handle selection for both single and multiple choice
const handleSelection = (option: string) => {
  if (isMultipleAnswer.value) {
    // For multiple answer questions, toggle the selected option
    const currentValue = props.modelValue;
    const index = currentValue.indexOf(option);

    if (index === -1) {
      emit("update:modelValue", [...currentValue, option]);
    } else {
      emit(
        "update:modelValue",
        currentValue.filter((item) => item !== option)
      );
    }
  } else {
    // For single answer questions, replace the array with just the selected option
    emit("update:modelValue", [option]);
  }
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <p
      v-if="isMultipleAnswer"
      class="-mt-2 mb-2 text-sm italic text-muted-foreground"
    >
      Choose all that apply
    </p>
    <div
      v-for="(option, index) in question.options"
      :key="option.option"
      class="relative"
    >
      <input
        :id="question.id + option.option"
        :type="isMultipleAnswer ? 'checkbox' : 'radio'"
        :checked="modelValue.includes(option.option)"
        :name="question.id"
        class="absolute w-0 h-0 opacity-0 peer"
        @change="handleSelection(option.option)"
      />
      <label
        :for="question.id + option.option"
        class="block p-3 w-full rounded-lg border border-gray-200 transition-colors cursor-pointer dark:border-gray-700 hover:bg-primary/20 hover:border-primary/20 peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary"
      >
        <span
          class="inline-flex justify-center items-center mr-3 w-6 h-6 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full transition-colors dark:bg-gray-800 dark:text-gray-300 group-hover:bg-primary/30 peer-checked:bg-primary-foreground peer-checked:text-primary"
        >
          {{ getLetterLabel(index) }}
        </span>
        <span>{{ option.option }}</span>
      </label>
    </div>
  </div>
</template>
