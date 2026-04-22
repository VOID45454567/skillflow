<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { Sun, Moon } from "@lucide/vue";

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <button
    @click="toggleTheme"
    class="theme-toggle group"
    :title="theme === 'light' ? 'Темная тема' : 'Светлая тема'"
  >
    <Sun v-if="theme === 'dark'" class="icon" />
    <Moon v-else class="icon" />
  </button>
</template>

<style scoped>
@reference "tailwindcss";
.theme-toggle {
  @apply rounded-xl transition-all duration-300
         bg-gray-100 dark:bg-gray-800
         hover:bg-gray-200 dark:hover:bg-gray-700
         text-gray-700 dark:text-gray-300;
}

.icon {
  @apply w-5 h-5 transition-transform duration-300
         group-hover:scale-110;
}
</style>
