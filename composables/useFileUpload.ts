import { ref, computed, toRaw } from "vue";

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadProgress: number;
  uploadedUrl?: string;
  error?: string;
}

interface UseFileUploadOptions {
  maxFileSize?: number; // in bytes, defaults to 10MB
  onFilesProcessed?: (files: UploadedFile[]) => void;
  storageBucket?: string; // Supabase storage bucket name
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const supabase = useSupabaseClient();

  // State
  const isDragging = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const uploadedFiles = ref<UploadedFile[]>([]);

  // Constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const STORAGE_BUCKET = options.storageBucket || "uploads";

  // Computed
  const maxFileSizeDisplay = computed(() => {
    const size = options.maxFileSize || MAX_FILE_SIZE;
    return `${size / (1024 * 1024)}MB`;
  });

  const allUploadsComplete = computed(() => {
    return (
      uploadedFiles.value.length > 0 &&
      uploadedFiles.value.every((file) => file.uploadStatus === "completed")
    );
  });

  /**
   * Creates a preview URL for an image file
   */
  function createPreview(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Validates a file meets the requirements
   */
  function validateFile(file: File): boolean {
    if (!file.type.startsWith("image/")) {
      alert("Please upload only image files");
      return false;
    }

    const maxSize = options.maxFileSize || MAX_FILE_SIZE;
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return false;
    }

    return true;
  }

  /**
   * Uploads a single file to Supabase storage with progress tracking
   */
  async function uploadFileToSupabase(
    uploadedFile: UploadedFile,
    index: number
  ) {
    const fileExt = uploadedFile.file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}_${Date.now()}.${fileExt}`;

    try {
      // Create a new object for the uploading state
      uploadedFiles.value[index] = {
        ...toRaw(uploadedFile),
        uploadStatus: "uploading",
        uploadProgress: 0,
      };

      // Get the signed URL for upload
      const { data, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, uploadedFile.file);

      if (uploadError || !data)
        throw uploadError || new Error("Failed to get signed URL");

      const {
        data: { publicUrl },
      } = await supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);

      // Create a new object for the completed state
      uploadedFiles.value[index] = {
        ...toRaw(uploadedFile),
        uploadedUrl: publicUrl,
        uploadStatus: "completed",
        uploadProgress: 100,
      };
    } catch (error) {
      // Create a new object for the error state
      uploadedFiles.value[index] = {
        ...toRaw(uploadedFile),
        uploadStatus: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      };
      console.error("Upload error:", error);
    }
  }

  /**
   * Processes an array of files, validates them, and adds them to uploadedFiles
   */
  async function handleFiles(files: File[]) {
    const uploadPromises = [];

    for (const file of files) {
      if (validateFile(file)) {
        const uploadedFile: UploadedFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: createPreview(file),
          uploadStatus: "pending",
          uploadProgress: 0,
        };

        // Add to uploadedFiles array
        const index = uploadedFiles.value.length;
        uploadedFiles.value.push(uploadedFile);

        // Start upload without awaiting
        uploadPromises.push(uploadFileToSupabase(uploadedFile, index));
      }
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    console.log(
      "Uploaded files:",
      uploadedFiles.value,
      allUploadsComplete.value
    );
  }

  /**
   * Handles files being dropped into the upload zone
   */
  async function handleDrop(event: DragEvent) {
    isDragging.value = false;
    const files = event.dataTransfer?.files;
    if (!files) return;

    await handleFiles(Array.from(files));
  }

  /**
   * Handles files being selected via the file input
   */
  async function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    await handleFiles(Array.from(input.files));
    input.value = ""; // Reset input
  }

  /**
   * Removes a file from the uploaded files array
   */
  function removeFile(index: number) {
    const file = uploadedFiles.value[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    uploadedFiles.value.splice(index, 1);
  }

  /**
   * Triggers the hidden file input
   */
  function triggerFileInput() {
    fileInput.value?.click();
  }

  /**
   * Processes the uploaded files
   */
  function processFiles() {
    if (options.onFilesProcessed) {
      options.onFilesProcessed(uploadedFiles.value);
    }
  }

  return {
    // State
    isDragging,
    fileInput,
    uploadedFiles,
    maxFileSizeDisplay,
    allUploadsComplete,

    // Methods
    handleDrop,
    handleFileSelect,
    removeFile,
    triggerFileInput,
    processFiles,
  };
}
