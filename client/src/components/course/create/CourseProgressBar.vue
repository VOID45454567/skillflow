<template>
  <div class="animate-fadeInUp" style="animation-delay: 0.1s">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-gray-500">Прогресс создания</span>
      <span class="text-sm font-medium text-primary">{{ percentage }}%</span>
    </div>
    <div class="h-2 bg-gray-200/60 rounded-full overflow-hidden">
      <div
        class="h-full bg-linear-to-r from-primary via-accent to-accent-pink rounded-full transition-all duration-500"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  percentage: number;
}>();
</script>
