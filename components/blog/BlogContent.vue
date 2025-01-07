<template>
  <div
    class="prose dark:prose-invert prose-lg max-w-none [&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline [&_h5_a]:no-underline [&_h6_a]:no-underline"
  >
    <ContentRenderer :value="content" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: any; // Type should match your content structure
}

defineProps<Props>();
</script>
