<script setup lang="ts">
// Define the Exam interface
interface Exam {
  id: string;
  name: string;
  createdAt: string;
  description?: string;
  scannedPages?: Array<{
    id: string;
    pageNumber?: number;
    pageImage?: string;
    status: string;
  }>;
}

// Get the exam ID from the route params
const route = useRoute();
const examId = computed(() => route.params.id as string);

// Fetch exam details using the exams service
const { data: exam } = await useFetch<Exam>(`/api/exams/${examId.value}`, {
  query: {
    include: "scannedPages",
  },
});

interface ExamEditableFields {
  name: string;
  description: string;
}

// Combined inline editing for both fields
const {
  isEditing,
  editedValue,
  startEdit,
  handleKeyDown,
  saveChanges,
  updateValue,
} = useInlineEdit<ExamEditableFields>({
  initialValue: {
    name: exam.value?.name || "",
    description: exam.value?.description || "",
  },
  onSave: async (value) => {
    await $fetch(`/api/exams/${examId.value}`, {
      method: "PUT",
      body: value,
    });

    if (exam.value) {
      exam.value.name = value.name;
      exam.value.description = value.description;
    }
  },
  validate: (value) => value.name.trim().length > 0,
});

// Computed properties for individual field editing states
const isTitleEditing = computed(() => isEditing.value);
const isDescriptionEditing = computed(() => isEditing.value);
const editedTitle = computed({
  get: () => editedValue.value.name,
  set: (value) => (editedValue.value = { ...editedValue.value, name: value }),
});
const editedDescription = computed({
  get: () => editedValue.value.description,
  set: (value) =>
    (editedValue.value = { ...editedValue.value, description: value }),
});

// Format the creation date
const formattedDate = computed(() => {
  if (!exam.value?.createdAt) return "";
  return new Date(exam.value.createdAt).toLocaleDateString();
});

// Watch for exam changes to update editable values
watch(exam, (newExam) => {
  if (!newExam) {
    throw createError({
      statusCode: 404,
      statusMessage: "Exam not found",
    });
  }
  updateValue({
    name: newExam.name || "",
    description: newExam.description || "",
  });
});
</script>

<template>
  <div v-if="exam" class="container py-8 space-y-8">
    <!-- Exam Header -->
    <div class="space-y-4">
      <div class="flex gap-3 justify-between items-center">
        <div class="flex items-center w-full">
          <!-- Editable title -->
          <div v-if="isTitleEditing" class="flex flex-1 items-center min-w-0">
            <input
              ref="titleInput"
              v-model="editedTitle"
              type="text"
              class="w-full text-3xl font-bold bg-transparent border-b border-primary focus:outline-none focus:border-primary-600 dark:border-primary-400"
              autofocus
              @blur="saveChanges"
              @keydown="handleKeyDown"
            />
          </div>
          <h1
            v-else
            class="text-3xl font-bold transition-colors cursor-pointer hover:text-primary"
            @click="startEdit"
          >
            {{ exam.name }}
          </h1>
        </div>
        <Button variant="outline" as="a" href="/dashboard/exams">
          <Icon name="heroicons:arrow-left" class="mr-2 w-4 h-4" />
          Back to Exams
        </Button>
      </div>

      <div class="flex items-center text-sm text-muted-foreground">
        <Icon name="heroicons:calendar" class="mr-2 w-4 h-4" />
        Created on {{ formattedDate }}
      </div>

      <!-- Editable description -->
      <div v-if="isDescriptionEditing" class="flex flex-1 items-center min-w-0">
        <textarea
          v-model="editedDescription"
          class="w-full min-h-[100px] text-base bg-transparent border rounded-md border-primary p-2 focus:outline-none focus:border-primary-600 dark:border-primary-400"
          autofocus
          @blur="saveChanges"
          @keydown="handleKeyDown"
        />
      </div>
      <div
        v-else
        class="cursor-pointer text-muted-foreground hover:text-primary group"
        @click="startEdit"
      >
        <p v-if="exam.description">{{ exam.description }}</p>
        <p v-else class="italic">Click to add a description</p>
      </div>
    </div>

    <!-- Scanned Pages Grid -->
    <div
      v-if="exam.scannedPages"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <ScannedPageCardDumb
        v-for="page in exam.scannedPages"
        :key="page.id"
        :page="page"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!exam.scannedPages?.length" class="py-12 text-center">
      <Icon
        name="heroicons:document"
        class="mx-auto w-12 h-12 text-muted-foreground"
      />
      <h3 class="mt-4 text-lg font-medium">No Pages Found</h3>
      <p class="mt-2 text-sm text-muted-foreground">
        This exam doesn't have any scanned pages yet.
      </p>
    </div>
  </div>
</template>
