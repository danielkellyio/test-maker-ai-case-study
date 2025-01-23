<script setup lang="ts">
const route = useRoute();
const id = computed(() => route.params.id);

const { data: exam } = await useFetch(`/api/exams/${id.value}`, {
  params: {
    include: ["questions"],
  },
});
</script>

<template>
  <div>
    <h1 class="mb-3 text-4xl font-bold">{{ exam.name }}</h1>
    <InteractiveExam v-if="exam" :exam-data="exam" />
  </div>
</template>
