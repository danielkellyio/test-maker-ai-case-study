<script setup lang="ts">
import type { ComponentQuestion } from "./types";

interface Props {
  question: ComponentQuestion;
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div class="flex gap-3">
    <div class="relative flex-1">
      <input
        :id="question.id + 'true'"
        type="radio"
        :name="question.id"
        value="true"
        :checked="modelValue === 'true'"
        class="absolute w-0 h-0 opacity-0 peer"
        @change="emit('update:modelValue', 'true')"
      />
      <label
        :for="question.id + 'true'"
        class="block p-3 w-full rounded-lg border border-gray-200 transition-colors cursor-pointer dark:border-gray-700 hover:bg-primary/20 hover:border-primary/20 peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary"
      >
        <span>True</span>
      </label>
    </div>

    <div class="relative flex-1">
      <input
        :id="question.id + 'false'"
        type="radio"
        :name="question.id"
        value="false"
        :checked="modelValue === 'false'"
        class="absolute w-0 h-0 opacity-0 peer"
        @change="emit('update:modelValue', 'false')"
      />
      <label
        :for="question.id + 'false'"
        class="block p-3 w-full rounded-lg border border-gray-200 transition-colors cursor-pointer dark:border-gray-700 hover:bg-primary/20 hover:border-primary/20 peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary"
      >
        <span>False</span>
      </label>
    </div>
  </div>
</template>
