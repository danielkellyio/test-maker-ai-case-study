<script setup lang="ts">
// Define props for the component
interface ScannedPage {
  id: string;
  pageNumber?: number;
  pageImage?: string;
  status: string;
  pageText?: string;
}

interface Props {
  page: ScannedPage;
}

defineProps<Props>();

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
        height="500"
        class="w-full h-[200px] object-cover"
      />
    </CardContent>
    <CardFooter class="p-4">
      <div class="flex justify-between items-center w-full">
        <span class="text-sm"> Page {{ page.pageNumber || "Unknown" }} </span>
        <Badge :variant="page.status === 'completed' ? 'default' : 'secondary'">
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
        <DialogDescription> Status: {{ page.status }} </DialogDescription>
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
