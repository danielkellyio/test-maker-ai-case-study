<script setup lang="ts">
// Fetch exams data with useFetch since this runs at component setup
const { data: exams, refresh, status } = await useFetch("/api/exams");

// Handle creating a new exam
const createExam = async () => {
  try {
    // Create a new exam with a default name, we'll let users edit it later
    await $fetch("/api/exams", {
      method: "POST",
      body: {
        name: "New Exam",
        description: "",
      },
    });
    // Refresh the page to show the new exam
    refresh();
  } catch (error) {
    console.error("Failed to create exam:", error);
  }
};
</script>

<template>
  <div class="container py-8">
    <!-- Header section -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">
          Exams
          <span v-if="status === 'pending'" class="animate-pulse">
            <Icon name="heroicons:spinner" class="w-4 h-4" />
          </span>
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Create and manage your exams
        </p>
      </div>
      <Button @click="createExam">
        <Icon name="heroicons:plus" class="mr-2 w-4 h-4" />
        New Exam
      </Button>
    </div>

    <!-- Exams grid -->
    <div v-if="exams?.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="exam in exams"
        :key="exam.id"
        :to="`/dashboard/exams/${exam.id}`"
        class="p-6 rounded-lg border transition-colors bg-card text-card-foreground hover:border-primary"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium">{{ exam.name }}</h3>
            <p
              v-if="exam.description"
              class="mt-2 text-sm text-muted-foreground line-clamp-2"
            >
              {{ exam.description }}
            </p>
            <p v-else class="mt-2 text-sm italic text-muted-foreground">
              No description
            </p>
          </div>
          <Icon
            name="heroicons:chevron-right"
            class="w-5 h-5 text-muted-foreground"
          />
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="py-12 text-center rounded-lg border bg-card text-card-foreground"
    >
      <Icon
        name="heroicons:document"
        class="mx-auto w-12 h-12 text-muted-foreground"
      />
      <h3 class="mt-4 text-lg font-medium">No exams found</h3>
      <p class="mt-2 text-sm text-muted-foreground">
        Get started by creating your first exam
      </p>
      <Button class="mt-4" @click="createExam">
        <Icon name="heroicons:plus" class="mr-2 w-4 h-4" />
        Create Exam
      </Button>
    </div>
  </div>
</template>
