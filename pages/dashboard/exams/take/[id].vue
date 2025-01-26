<script setup lang="ts">
import type { Exam } from "@/server/api/exams/[id].get";

const route = useRoute();
const id = computed(() => route.params.id);

const { data: exam } = await useFetch<Exam>(`/api/exams/${id.value}`, {
  params: {
    include: ["questions"],
  },
});

if (!exam.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Exam not found",
  });
}

// State for submission status
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const error = ref<string | null>(null);

// Handle exam submission
const handleSubmit = async (answers: Record<string, string | string[]>) => {
  isSubmitting.value = true;
  error.value = null;

  try {
    await $fetch("/api/submissions", {
      method: "POST",
      body: {
        examId: id.value,
        // Convert answers object to array format expected by API
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          // Convert array answers to comma-separated string
          answer: Array.isArray(answer) ? answer.join(",") : answer,
        })),
      },
    });

    isSubmitted.value = true;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : "Failed to submit exam";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="exam?.questions">
    <h1 class="mb-3 text-4xl font-bold">{{ exam.name }}</h1>

    <!-- Show error if submission failed -->
    <Alert v-if="error" variant="destructive" class="mb-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Show success message if submitted -->
    <Alert v-if="isSubmitted" variant="default" class="mb-4">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription
        >Your exam has been submitted successfully.</AlertDescription
      >
    </Alert>

    <!-- Show exam if not submitted yet -->
    <InteractiveExam
      v-if="!isSubmitted"
      :questions="exam.questions"
      @submit="handleSubmit"
    />

    <!-- Show loading state -->
    <div
      v-if="isSubmitting"
      class="flex fixed inset-0 justify-center items-center bg-background/80"
    >
      <LoadingSpinner />
    </div>
  </div>
</template>
