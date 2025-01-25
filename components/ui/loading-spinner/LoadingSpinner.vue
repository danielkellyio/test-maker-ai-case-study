<script setup lang="ts">
interface Props {
  /**
   * The size of the spinner in pixels
   * @default 48
   */
  size?: number;
  /**
   * Whether to show a semi-transparent backdrop with blur
   * @default false
   */
  withBackdrop?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 48,
  withBackdrop: false,
});
</script>

<template>
  <div
    :class="[
      'flex justify-center items-center',
      withBackdrop && 'absolute inset-0 backdrop-blur-sm bg-background/50',
    ]"
  >
    <div
      :style="{ width: `${size}px`, height: `${size}px` }"
      class="rounded-full border-4 animate-spin border-primary border-t-transparent dark:border-primary-foreground dark:border-t-transparent"
    ></div>
  </div>
</template>
