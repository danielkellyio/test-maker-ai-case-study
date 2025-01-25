<script setup lang="ts">
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
  isRescanning?: boolean;
}

defineProps<Props>();
defineEmits(["refresh", "rescan"]);

// State for dialogs
const isDetailsOpen = ref(false);
const isImageMaximized = ref(false);
</script>

<template>
  <!-- Preview Card -->
  <ScannedPagePreviewDumb
    :page="page"
    @click="isDetailsOpen = true"
    @refresh="$emit('refresh')"
  />

  <!-- Details Dialog -->
  <ScannedPageDetailsDumb
    :page="page"
    :is-open="isDetailsOpen"
    :is-rescanning="isRescanning"
    @update:is-open="isDetailsOpen = $event"
    @rescan="$emit('rescan')"
    @maximize="isImageMaximized = true"
  />

  <!-- Full Screen Image Dialog -->
  <ScannedPageFullScreenDumb
    :page="page"
    :is-open="isImageMaximized"
    @update:is-open="isImageMaximized = $event"
  />
</template>
