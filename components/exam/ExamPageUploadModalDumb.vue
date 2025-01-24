<script setup lang="ts">
interface Props {
  examId: string;
  isOpen: boolean;
}

// Define props and emits
const props = defineProps<Props>();
const emit = defineEmits<{
  "update:isOpen": [value: boolean];
}>();

// Handle dialog state
const handleOpenChange = (open: boolean) => {
  emit("update:isOpen", open);
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Scan Additional Pages </DialogTitle>
        <DialogDescription>
          Upload additional pages to include in this exam's content. This action
          does NOT generate new questions. Once new pages are uploaded, use the
          "Generate Questions" button to create questions from the new pages.
        </DialogDescription>
      </DialogHeader>

      <ExamPageUploaderDumb
        :exam-id="examId"
        @success="handleOpenChange(false)"
      />
    </DialogContent>
  </Dialog>
</template>
