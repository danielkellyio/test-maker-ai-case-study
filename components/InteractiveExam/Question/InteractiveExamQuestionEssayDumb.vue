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
  <Textarea
    :value="modelValue"
    class="min-h-[300px]"
    placeholder="Write your essay answer..."
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
