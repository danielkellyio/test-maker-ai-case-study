<script setup lang="ts">
import { useToast } from "@/components/ui/toast";
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
}

const props = defineProps<Props>();
const emit = defineEmits(["refresh"]);

// State for loading during rescan
const isRescanning = ref(false);

// Toast for notifications
const { toast } = useToast();

// Handle rescan action
async function handleRescan() {
  try {
    isRescanning.value = true;
    await $fetch(`/api/scannedPages/queue/${props.page.id}`, {
      method: "POST",
    });

    toast({
      title: "Success",
      description: "Page has been queued for rescanning",
    });

    emit("refresh");
  } catch (error) {
    toast({
      title: "Error",
      description:
        error instanceof Error ? error.message : "Failed to rescan page",
      variant: "destructive",
    });
  } finally {
    isRescanning.value = false;
  }
}
</script>

<template>
  <ScannedPageCardDumb
    :page="page"
    :is-rescanning="isRescanning"
    @rescan="handleRescan"
    @refresh="$emit('refresh')"
  />
</template>
