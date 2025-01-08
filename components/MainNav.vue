<template>
  <nav
    class="flex justify-between items-center px-4 py-4 bg-white shadow-sm dark:bg-gray-800"
  >
    <ul class="flex gap-8 p-0 m-0 list-none">
      <li>
        <NuxtLink
          to="/"
          class="font-medium text-gray-700 transition-colors dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
          active-class="text-emerald-600 dark:text-emerald-400"
        >
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/blog"
          class="font-medium text-gray-700 transition-colors dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
          active-class="text-emerald-600 dark:text-emerald-400"
        >
          Blog
        </NuxtLink>
      </li>
    </ul>

    <div class="flex gap-4 items-center">
      <button
        class="flex justify-center items-center p-2 text-xl rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Toggle dark mode"
        @click="toggleDark"
      >
        <Icon
          :name="colorMode.value === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'"
          class="w-6 h-6"
        />
      </button>

      <UserNavDropdown v-if="loggedIn" />
      <NuxtLink
        v-else
        to="/login"
        class="font-medium text-gray-700 transition-colors dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
      >
        Login
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const { loggedIn } = useUserSession();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>
