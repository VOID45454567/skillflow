<template>
  <div
    class="glass rounded-2xl p-6 card-hover animate-fadeInUp"
    :style="{ animationDelay: `${delay}s` }"
  >
    <div
      class="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 animate-float"
      :class="gradientClass"
      :style="{ animationDelay: `${-delay * 0.5}s` }"
    >
      <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
    </div>
    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ value }}</h3>
    <p class="text-sm text-gray-500">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";

const props = defineProps<{
  icon: Component;
  value: string;
  label: string;
  color?: "primary" | "pink" | "cyan";
  delay?: number;
}>();

const gradientClass = computed(() => {
  const gradients: Record<string, string> = {
    primary: "from-primary/20 to-accent/20",
    pink: "from-accent-pink/20 to-rose-300/20",
    cyan: "from-accent-cyan/20 to-blue-300/20",
  };
  return gradients[props.color || "primary"];
});

const iconColorClass = computed(() => {
  const colors: Record<string, string> = {
    primary: "text-primary",
    pink: "text-accent-pink",
    cyan: "text-cyan-500",
  };
  return colors[props.color || "primary"];
});
</script>
