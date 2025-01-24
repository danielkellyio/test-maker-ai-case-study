<script setup lang="ts">
// Get the exam ID from the route params
import type { Exam } from "~/server/api/exams/[id]";
const route = useRoute();
const examId = computed(() => route.params.id as string);

// Fetch exam details using the exams service
const { data: exam, refresh } = await useFetch<Exam>(
  `/api/exams/${examId.value}`,
  {
    query: {
      // Includes scanned pages and questionsCount
      // no need to add questionsCount to the query
      include: "scannedPages",
    },
  }
);

// Dialog state for confirmation
const showConfirmDialog = ref(false);

interface ExamEditableFields {
  name: string;
  description: string;
}

if (!exam.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Exam not found",
  });
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

async function generateExam() {
  // If there are existing questions, show confirmation dialog
  if (exam.value?.questionsCount && exam.value.questionsCount > 0) {
    showConfirmDialog.value = true;
    return;
  }

  await performGeneration();
}

// Separate function to perform the actual generation
async function performGeneration() {
  await $fetch(`/api/exams/generate`, {
    method: "POST",
    body: {
      examId: examId.value,
      numberOfQuestions: 10,
    },
  });
  refresh();
}

// Add handlers for menu actions
async function handleTakeExam() {
  navigateTo(`/dashboard/exams/take/${examId.value}`);
}

async function handleEditQuestions() {
  // TODO: Implement edit questions functionality
  console.log("Edit questions clicked");
}

async function handleScanPages() {
  // TODO: Implement scan pages functionality
  console.log("Scan pages clicked");
}
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
        <ExamActionsMenuDumb
          :exam-id="examId"
          @generate="generateExam"
          @take="handleTakeExam"
          @edit="handleEditQuestions"
          @scan="handleScanPages"
        />
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
      class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      <ScannedPageCardDumb
        v-for="page in exam.scannedPages"
        :key="page.id"
        :page="page"
        @refresh="refresh"
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

    <Dialog :open="showConfirmDialog" @update:open="showConfirmDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Exam Generation</DialogTitle>
          <DialogDescription>
            This exam already has {{ exam?.questionsCount }} questions.
            Generating new questions will replace all existing ones. Are you
            sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showConfirmDialog = false"
            >Cancel</Button
          >
          <Button
            @click="
              async () => {
                showConfirmDialog = false;
                await performGeneration();
              }
            "
            >Continue</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
