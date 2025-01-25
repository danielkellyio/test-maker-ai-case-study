<script setup lang="ts">
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
  isOpen: boolean;
}

defineProps<Props>();
defineEmits(["update:isOpen"]);
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-[95vw] max-h-[95vh] w-full h-full p-6">
      <DialogHeader>
        <DialogTitle class="flex justify-between items-center">
          <span>Page {{ page.pageNumber || "Unknown" }}</span>
        </DialogTitle>
      </DialogHeader>

      <div class="overflow-y-auto h-full">
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
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
