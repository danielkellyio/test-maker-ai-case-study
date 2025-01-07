<template>
  <div
    class="overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
    :class="sizeClasses[size]"
  >
    <img v-if="src" :src="src" :alt="alt" class="h-full w-full object-cover" />
    <svg
      v-else
      class="h-full w-full text-gray-300 dark:text-gray-600"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "Avatar",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
});

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};
</script>
