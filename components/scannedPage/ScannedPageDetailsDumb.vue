<script setup lang="ts">
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
  isOpen: boolean;
  isRescanning?: boolean;
}

defineProps<Props>();
defineEmits(["update:isOpen", "rescan", "maximize"]);
</script>

<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Page {{ page.pageNumber || "Unknown" }}</DialogTitle>
        <DialogDescription class="flex gap-2 items-center">
          Status:
          <Badge
            :variant="
              page.status === 'completed'
                ? 'default'
                : page.status === 'failed'
                ? 'destructive'
                : 'secondary'
            "
          >
            {{ page.status }}
          </Badge>
          <Button
            v-if="page.status === 'failed'"
            variant="outline"
            size="sm"
            :disabled="isRescanning"
            @click.stop="$emit('rescan')"
          >
            <Icon
              v-if="isRescanning"
              name="heroicons:arrow-path"
              class="mr-2 w-4 h-4 animate-spin"
            />
            <Icon v-else name="heroicons:arrow-path" class="mr-2 w-4 h-4" />
            Rescan Page
          </Button>
        </DialogDescription>
      </DialogHeader>

      <!-- Page Content -->
      <div class="grid gap-4 py-4">
        <div v-if="page.pageImage" class="flex relative justify-center">
          <div class="relative">
            <NuxtImg
              :src="page.pageImage"
              :alt="`Page ${page.pageNumber || 'Unknown'}`"
              width="300"
              height="400"
              class="max-h-[400px] object-contain rounded-lg"
              :modifiers="{
                rotate: null,
              }"
            />
            <Button
              variant="ghost"
              size="icon"
              class="absolute top-2 right-2 backdrop-blur-sm bg-background/80 hover:bg-background/90"
              @click="$emit('maximize')"
            >
              <Icon name="heroicons:arrows-pointing-out" class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Markdown Content -->
        <div v-if="page.pageText" class="max-w-none prose dark:prose-invert">
          <MDC :value="page.pageText" tag="article" />
        </div>
        <div v-else class="italic text-center text-muted-foreground">
          No text content available for this page
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
