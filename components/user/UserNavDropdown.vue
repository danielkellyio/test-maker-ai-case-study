<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const { user, clear } = useUserSession();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const handleLogout = async () => {
  await clear();
  // Close dropdown after logout
  isOpen.value = false;
};

// Use VueUse's onClickOutside composable to handle closing the dropdown
onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      class="flex gap-2 items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      @click="isOpen = !isOpen"
    >
      <NuxtImg
        :src="user?.avatar || ''"
        :alt="`${user?.login}'s avatar`"
        class="object-cover w-8 h-8 rounded-full"
        width="32"
        height="32"
      />
      <Icon
        name="heroicons:chevron-down"
        class="w-4 h-4 text-gray-600 dark:text-gray-300"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 py-2 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ user?.login }}
        </p>
      </div>
      <button
        class="px-4 py-2 w-full text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </div>
</template>
