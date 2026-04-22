<template>
  <div class="glass rounded-xl p-4 card-hover cursor-pointer" @click="$emit('click')">
    <div class="flex items-start gap-4">
      <!-- Иконка с прогрессом -->
      <div class="relative w-12 h-12 shrink-0">
        <div
          class="w-12 h-12 rounded-xl bg-linear-to-br from-accent/20 to-accent-pink/20 flex items-center justify-center"
        >
          <ShoppingBag class="h-6 w-6 text-accent" />
        </div>
        <!-- Индикатор прогресса (круговой) -->
        <svg class="absolute -bottom-1 -right-1 w-6 h-6 transform -rotate-90">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            class="text-gray-200"
            stroke="currentColor"
            stroke-width="2"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            :class="progressColor"
            stroke="currentColor"
            stroke-width="2"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-800 truncate mb-1">{{ course.title }}</h3>
        <p class="text-sm text-gray-500 line-clamp-1 mb-2">{{ course.description }}</p>

        <!-- Прогресс бар -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500">Прогресс</span>
            <span class="font-medium" :class="progressTextColor"
              >{{ Math.round(progressPercent) }}%</span
            >
          </div>
          <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="progressBarColor"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
        </div>

        <!-- Статус и информация -->
        <div class="flex items-center justify-between mt-2">
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass"></span>
            {{ statusLabel }}
          </span>

          <span v-if="progressData?.completedLessonsCount" class="text-xs text-gray-400">
            {{ progressData.completedLessonsCount }}/{{ progressData.totalLessons }}
            уроков
          </span>
        </div>
      </div>

      <ChevronRight class="h-5 w-5 text-gray-400 shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ShoppingBag, ChevronRight } from "@lucide/vue";
import type { Course } from "@/types/course";
import type { UserCourseProgress } from "@/types/userCourseProgress";

const props = defineProps<{
  course: Course;
  progress?: UserCourseProgress | null;
}>();

defineEmits<{
  click: [];
}>();

const progressData = computed(() => props.progress);

const progressPercent = computed(() => {
  if (!progressData.value) return 0;
  const progress = progressData.value.progress;
  return typeof progress === "string" ? parseFloat(progress) : progress;
});

const statusLabel = computed(() => {
  if (!progressData.value) return "Не начат";
  if (progressData.value.completedAt) return "Завершён";
  if (progressPercent.value === 0) return "Не начат";
  if (progressPercent.value >= 100) return "Завершён";
  return "В процессе";
});

const statusClass = computed(() => {
  if (!progressData.value || progressPercent.value === 0) {
    return "bg-gray-100 text-gray-600";
  }
  if (progressData.value.completedAt || progressPercent.value >= 100) {
    return "bg-emerald-500/10 text-emerald-600";
  }
  return "bg-accent-cyan/10 text-accent-cyan";
});

const statusDotClass = computed(() => {
  if (!progressData.value || progressPercent.value === 0) return "bg-gray-500";
  if (progressData.value.completedAt || progressPercent.value >= 100)
    return "bg-emerald-500";
  return "bg-accent-cyan";
});

const progressColor = computed(() => {
  if (progressData.value?.completedAt || progressPercent.value >= 100)
    return "text-emerald-500";
  if (progressPercent.value > 0) return "text-accent-cyan";
  return "text-gray-300";
});

const progressTextColor = computed(() => {
  if (progressData.value?.completedAt || progressPercent.value >= 100)
    return "text-emerald-600";
  if (progressPercent.value > 0) return "text-accent-cyan";
  return "text-gray-500";
});

const progressBarColor = computed(() => {
  if (progressData.value?.completedAt || progressPercent.value >= 100)
    return "bg-gradient-to-r from-emerald-500 to-teal-500";
  if (progressPercent.value > 0) return "bg-gradient-to-r from-accent-cyan to-primary";
  return "bg-gray-300";
});

const circumference = 2 * Math.PI * 10;
const progressOffset = computed(
  () => circumference - (progressPercent.value / 100) * circumference
);
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
