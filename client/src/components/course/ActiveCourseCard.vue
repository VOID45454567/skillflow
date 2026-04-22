<template>
  <div class="glass rounded-xl p-4 card-hover cursor-pointer" @click="$emit('click')">
    <div class="flex items-start gap-4">
      <div
        class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-primary/20 flex items-center justify-center shrink-0"
      >
        <PlayCircle class="h-7 w-7 text-accent-cyan" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-semibold text-gray-800 truncate">{{ course.title }}</h3>
          <span
            class="text-xs font-medium px-2 py-1 rounded-full ml-2 shrink-0 bg-accent-cyan/10 text-accent-cyan"
          >
            В процессе
          </span>
        </div>
        <p class="text-sm text-gray-500 line-clamp-1 mb-3">{{ course.description }}</p>

        <!-- Прогресс -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500">Прогресс</span>
            <span class="font-medium text-accent-cyan">
              {{ Math.round(progressPercent) }}%
            </span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-accent-cyan to-primary rounded-full transition-all"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-2 text-xs">
          <Clock class="h-3 w-3 text-gray-400" />
          <span class="text-gray-500">
            {{ progressData?.completedLessonsCount || 0 }} /
            {{ progressData?.totalLessons || 0 }} уроков
          </span>
          <span v-if="progressData?.currentLesson" class="text-gray-400">•</span>
          <span v-if="progressData?.currentLesson" class="text-gray-700 truncate">
            {{ progressData.currentLesson.title }}
          </span>
        </div>
      </div>

      <ChevronRight class="h-5 w-5 text-gray-400 shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PlayCircle, Clock, ChevronRight } from "@lucide/vue";
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
const progressPercent = computed(() => props.progress?.progress || 0);
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
