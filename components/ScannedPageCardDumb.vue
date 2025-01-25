<script setup lang="ts">
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
  isRescanning?: boolean;
}

defineProps<Props>();
defineEmits(["refresh", "rescan"]);

// State for dialog
const isOpen = ref(false);
</script>

<template>
  <Card class="overflow-hidden cursor-pointer" @click="isOpen = true">
    <CardContent class="p-0">
      <NuxtImg
        v-if="page.pageImage"
        :src="page.pageImage"
        :alt="`Page ${page.pageNumber || 'Unknown'}`"
        width="400"
        height="400"
        class="w-full h-[400px] object-cover"
        fit="inside"
        :modifiers="{
          rotate: 90,
        }"
      />
    </CardContent>
    <CardFooter class="p-4">
      <div class="flex justify-between items-center w-full">
        <span class="text-sm"> Page {{ page.pageNumber || "Unknown" }} </span>
        <Badge
          :variant="
            page.status === 'completed'
              ? 'default'
              : page.status === 'failed'
              ? 'destructive'
              : 'secondary'
          "
          @click.stop.prevent="$emit('refresh')"
        >
          {{ page.status }}
        </Badge>
      </div>
    </CardFooter>
  </Card>

  <!-- Modal Dialog -->
  <Dialog :open="isOpen" @update:open="isOpen = $event">
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
        <div v-if="page.pageImage" class="flex justify-center">
          <NuxtImg
            :src="page.pageImage"
            :alt="`Page ${page.pageNumber || 'Unknown'}`"
            width="600"
            height="800"
            class="max-h-[400px] object-contain rounded-lg"
          />
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
