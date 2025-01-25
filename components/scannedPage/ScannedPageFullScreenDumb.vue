<script setup lang="ts">
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
  isOpen: boolean;
}

defineProps<Props>();
defineEmits(["update:isOpen"]);

// Track the loading state of the image
const isImageLoading = ref(true);

// Handler for when image finishes loading
const onImageLoad = () => {
  isImageLoading.value = false;
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-[95vw] max-h-[95vh] w-full h-full p-6">
      <DialogHeader>
        <DialogTitle class="flex justify-between items-center">
          <span>Page {{ page.pageNumber || "Unknown" }}</span>
        </DialogTitle>
      </DialogHeader>
      <LoadingSpinner v-if="isImageLoading" :with-backdrop="true" />
      <div class="overflow-y-auto relative h-full">
        <NuxtImg
          v-if="page.pageImage"
          :src="page.pageImage"
          :alt="`Page ${page.pageNumber || 'Unknown'}`"
          class="object-contain w-auto max-w-full h-auto"
          width="2400"
          height="2400"
          fit="contain"
          :modifiers="{
            rotate: null,
          }"
          @load="onImageLoad"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
