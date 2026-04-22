<template>
  <button
    :class="[
      'inline-flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizeClasses[size],
      { 'w-full': block },
    ]"
    :disabled="loading || disabled"
    @click="$emit('click')"
  >
    <RefreshCw v-if="loading" class="w-4 h-4 animate-spin" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RefreshCw } from "@lucide/vue";

type ButtonVariant = "filled" | "tonal" | "outlined" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
  }>(),
  {
    variant: "filled",
    size: "md",
    loading: false,
    disabled: false,
    block: false,
  }
);

defineEmits<{
  click: [];
}>();

// Используем CSS-переменные для цветов
const variants: Record<ButtonVariant, string> = {
  filled:
    "text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] shadow-md shadow-[var(--color-primary)]/20",
  tonal:
    "text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20",
  outlined: "text-gray-700 border border-gray-200 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5",
  lg: "px-6 py-3 text-lg",
};
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
