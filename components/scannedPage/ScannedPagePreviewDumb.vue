<script setup lang="ts">
import type { scannedPagesTable } from "~/server/db/schema";

type ScannedPage = typeof scannedPagesTable.$inferSelect;

interface Props {
  page: ScannedPage;
}

defineProps<Props>();
defineEmits(["click", "refresh"]);
</script>

<template>
  <Card class="overflow-hidden cursor-pointer" @click="$emit('click')">
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
          rotate: null,
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
</template>
