<template>
  <nav
    class="px-4 py-4 bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center"
  >
    <ul class="flex gap-8 list-none m-0 p-0">
      <li>
        <NuxtLink
          to="/"
          class="text-gray-700 dark:text-gray-200 font-medium hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          active-class="text-emerald-600 dark:text-emerald-400"
        >
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/blog"
          class="text-gray-700 dark:text-gray-200 font-medium hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          active-class="text-emerald-600 dark:text-emerald-400"
        >
          Blog
        </NuxtLink>
      </li>
    </ul>
    <button
      @click="toggleDark"
      class="p-2 text-xl rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {{ colorMode.value === "dark" ? "🌞" : "🌙" }}
    </button>
  </nav>
</template>

<script setup>
const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>
