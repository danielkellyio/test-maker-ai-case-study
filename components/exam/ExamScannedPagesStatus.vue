<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Props {
  /** The ID of the exam to monitor scanned pages for */
  examId: string;
}

const props = defineProps<Props>();

// Get the Supabase client instance
const supabase = useSupabaseClient();

// Track the subscription
const subscription = ref<RealtimeChannel | null>(null);

interface ScannedPage {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  pageNumber: string | null;
}

// Store the scanned pages statuses
const scannedPagesStatus = ref<ScannedPage[]>([]);

// Computed properties for status display
const totalPages = computed(() => scannedPagesStatus.value.length);
const completedPages = computed(
  () =>
    scannedPagesStatus.value.filter((page) => page.status === "completed")
      .length
);
const hasErrors = computed(() =>
  scannedPagesStatus.value.some((page) => page.status === "failed")
);
const hasPending = computed(() =>
  scannedPagesStatus.value.some(
    (page) => page.status === "pending" || page.status === "processing"
  )
);

const statusColor = computed(() => {
  if (hasErrors.value) return "bg-red-100 dark:bg-red-900";
  if (hasPending.value) return "bg-gray-100 dark:bg-gray-900";
  if (totalPages.value > 0) return "bg-green-100 dark:bg-green-900";
  return "bg-gray-100 dark:bg-gray-900";
});

const textColor = computed(() => {
  if (hasErrors.value) return "text-red-700 dark:text-red-300";
  if (hasPending.value) return "text-gray-700 dark:text-gray-300";
  if (totalPages.value > 0) return "text-green-700 dark:text-green-300";
  return "text-gray-700 dark:text-gray-300";
});

// Subscribe to changes when the component mounts
onMounted(async () => {
  // First get the initial state
  const { data: initialPages } = await supabase
    .from("scannedPages")
    .select("id, status, pageNumber")
    .eq("examId", props.examId);

  if (initialPages) {
    scannedPagesStatus.value = initialPages;
  }

  // Then subscribe to changes
  subscription.value = supabase
    .channel("scanned-pages-changes")
    .on(
      "postgres_changes",
      {
        event: "*", // Listen to all events
        schema: "public",
        table: "scannedPages",
        filter: `examId=eq.${props.examId}`,
      },
      (payload) => {
        // Handle different database events
        if (payload.eventType === "INSERT") {
          scannedPagesStatus.value.push(payload.new as ScannedPage);
        } else if (payload.eventType === "UPDATE") {
          const index = scannedPagesStatus.value.findIndex(
            (page) => page.id === (payload.new as ScannedPage).id
          );
          if (index !== -1) {
            scannedPagesStatus.value[index] = payload.new as ScannedPage;
          }
        } else if (payload.eventType === "DELETE") {
          scannedPagesStatus.value = scannedPagesStatus.value.filter(
            (page) => page.id !== (payload.old as ScannedPage).id
          );
        }
      }
    )
    .subscribe();
});

// Clean up subscription when component unmounts
onUnmounted(() => {
  if (subscription.value) {
    // @ts-expect-error - 🤷 don't know
    supabase.removeChannel(subscription.value);
  }
});
</script>

<template>
  <div class="flex gap-2 items-center">
    <div
      class="w-2 h-2 rounded-full"
      :class="[statusColor, { 'animate-pulse': hasPending }]"
    />
    <div :class="textColor">{{ completedPages }}/{{ totalPages }}</div>
  </div>
</template>

<style>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
