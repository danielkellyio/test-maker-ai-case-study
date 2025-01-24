<script setup lang="ts">
import { useToast } from "@/components/ui/toast";
const props = defineProps<{
  maxFileSize?: number; // in bytes, defaults to 10MB
  examId?: string; // Optional - if provided, pages will be added to an existing exam
}>();

const emit = defineEmits<{
  success: [examId: string];
}>();

const toast = useToast();

const {
  isDragging,
  fileInput,
  uploadedFiles,
  maxFileSizeDisplay,
  allUploadsComplete,
  handleDrop,
  handleFileSelect,
  removeFile,
  triggerFileInput,
  processFiles,
} = useFileUpload({
  storageBucket: "textbook-pages",
  maxFileSize: props.maxFileSize,
  onFilesProcessed: async (files) => {
    try {
      const res = await $fetch("/api/scannedPages/queue", {
        method: "POST",
        body: {
          images: files.map((file) => file.uploadedUrl),
          examId: props.examId, // Pass the examId if it exists
        },
      });

      toast.toast({
        title: "Success",
        description: "Your files have been queued for processing",
        variant: "default",
      });

      // Emit success with the exam ID and navigate only if not in modal mode
      emit("success", res.exam.id);
      if (!props.examId) {
        navigateTo(`/dashboard/exams/${res.exam.id}`);
      }
    } catch (error) {
      toast.toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to queue files for processing",
        variant: "destructive",
      });
    }
  },
});
</script>

<template>
  <Card class="w-full max-w-2xl">
    <CardHeader>
      <CardDescription>
        Upload images of textbook pages to generate exam questions. Supported
        formats: PNG, JPG, JPEG
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div
        class="p-8 text-center rounded-lg border-2 border-dashed transition-colors hover:border-primary"
        :class="isDragging ? 'border-primary bg-primary/5' : 'border-muted'"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div class="space-y-4">
          <Icon
            name="heroicons:photo"
            class="mx-auto w-12 h-12 text-muted-foreground"
          />
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">
              Drag and drop your images here, or
              <Button variant="link" class="px-1" @click="triggerFileInput">
                browse
              </Button>
              to choose files
            </p>
            <p class="text-xs text-muted-foreground">
              Maximum file size: {{ maxFileSizeDisplay }}
            </p>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
      </div>

      <!-- Preview of uploaded files -->
      <div v-if="uploadedFiles.length" class="mt-6 space-y-4">
        <p class="text-sm font-medium">Uploaded Files:</p>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="file.id"
            class="relative group"
          >
            <!-- Image Preview -->
            <div
              class="overflow-hidden relative rounded-lg border aspect-square bg-muted"
            >
              <img
                v-if="file.preview"
                :src="file.preview"
                :alt="file.file.name"
                class="object-cover w-full h-full"
              />

              <!-- Upload Progress Overlay -->
              <div
                v-if="file.uploadStatus === 'uploading'"
                class="flex absolute inset-0 justify-center items-center bg-background/80"
              >
                <div class="w-full max-w-[80%] space-y-2">
                  <div class="overflow-hidden h-2 rounded-full bg-muted">
                    <div
                      class="h-full transition-all duration-300 bg-primary"
                      :style="{ width: `${file.uploadProgress}%` }"
                    />
                  </div>
                  <p class="text-xs text-center text-muted-foreground">
                    Uploading... {{ file.uploadProgress }}%
                  </p>
                </div>
              </div>

              <!-- Error State -->
              <div
                v-if="file.uploadStatus === 'error'"
                class="flex absolute inset-0 justify-center items-center bg-destructive/10"
              >
                <div class="p-4 text-center">
                  <Icon
                    name="heroicons:exclamation-triangle"
                    class="mx-auto mb-2 w-8 h-8 text-destructive"
                  />
                  <p class="text-xs text-destructive">
                    {{ file.error || "Upload failed" }}
                  </p>
                </div>
              </div>

              <!-- Success Indicator -->
              <div
                v-if="file.uploadStatus === 'completed'"
                class="absolute top-2 right-2"
              >
                <div class="p-1 rounded-full bg-background/80">
                  <Icon
                    name="heroicons:check-circle"
                    class="w-5 h-5 text-success"
                  />
                </div>
              </div>
            </div>

            <!-- Filename and Remove Button -->
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs truncate max-w-[80%]">{{
                file.file.name
              }}</span>
              <Button
                variant="ghost"
                size="icon"
                class="w-6 h-6"
                @click="removeFile(index)"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button
        :disabled="!allUploadsComplete || !uploadedFiles.length"
        @click="processFiles"
      >
        Generate Exam
        <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
      </Button>
    </CardFooter>
  </Card>
</template>
