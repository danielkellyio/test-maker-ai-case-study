<script setup lang="ts">
// Types for our quiz data
interface Option {
  option: string;
  isCorrect: number;
  explanation?: string;
}

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-in-the-blank" | "essay";
  question: string;
  options?: Option[];
  answer?: string;
  alternateAnswers?: string[];
  explanation?: string;
}

// Props and emits definition
interface Props {
  question: Question;
  modelValue: string | string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

// Handle value updates
const updateValue = (value: string | string[]) => {
  emit("update:modelValue", value);
};

// Handle multiple choice selection
const handleMultipleChoice = (option: string) => {
  const currentValue = Array.isArray(props.modelValue) ? props.modelValue : [];
  const index = currentValue.indexOf(option);

  if (index === -1) {
    updateValue([...currentValue, option]);
  } else {
    updateValue(currentValue.filter((item) => item !== option));
  }
};
</script>

<template>
  <div class="p-6 rounded-lg border shadow-sm bg-card text-card-foreground">
    <h3 class="mb-4 text-lg font-medium">{{ question.question }}</h3>

    <div class="space-y-4">
      <!-- Multiple Choice -->
      <template v-if="question.type === 'multiple-choice'">
        <div
          v-for="option in question.options"
          :key="option.option"
          class="flex items-start space-x-3"
        >
          <input
            :id="question.id + option.option"
            type="checkbox"
            :checked="
              Array.isArray(modelValue) && modelValue.includes(option.option)
            "
            class="mt-1"
            @change="handleMultipleChoice(option.option)"
          />
          <label :for="question.id + option.option" class="text-sm">{{
            option.option
          }}</label>
        </div>
      </template>

      <!-- True/False -->
      <template v-else-if="question.type === 'true-false'">
        <div class="flex space-x-4">
          <div class="flex items-center space-x-2">
            <input
              :id="question.id + 'true'"
              type="radio"
              :name="question.id"
              value="true"
              :checked="modelValue === 'true'"
              @change="updateValue('true')"
            />
            <label :for="question.id + 'true'" class="text-sm">True</label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              :id="question.id + 'false'"
              type="radio"
              :name="question.id"
              value="false"
              :checked="modelValue === 'false'"
              @change="updateValue('false')"
            />
            <label :for="question.id + 'false'" class="text-sm">False</label>
          </div>
        </div>
      </template>

      <!-- Fill in the blank -->
      <template v-else-if="question.type === 'fill-in-the-blank'">
        <input
          type="text"
          :value="modelValue as string"
          class="px-3 py-2 w-full rounded-md border"
          placeholder="Enter your answer..."
          @input="e => updateValue((e.target as HTMLInputElement).value)"
        />
      </template>

      <!-- Essay -->
      <template v-else-if="question.type === 'essay'">
        <textarea
          :value="modelValue as string"
          rows="4"
          class="px-3 py-2 w-full rounded-md border"
          placeholder="Write your essay answer..."
          @input="e => updateValue((e.target as HTMLInputElement).value)"
        ></textarea>
      </template>
    </div>
  </div>
</template>
