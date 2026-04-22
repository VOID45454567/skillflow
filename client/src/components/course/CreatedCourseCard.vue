<template>
  <div class="glass rounded-xl p-4 card-hover cursor-pointer" @click="$emit('click')">
    <div class="flex items-start gap-4">
      <!-- Иконка -->
      <div
        class="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0"
      >
        <BookOpen class="h-6 w-6 text-primary" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="font-semibold text-gray-800 truncate">{{ course.title }}</h3>
          <span
            class="px-2 py-0.5 rounded-md text-xs font-medium shrink-0"
            :class="visibilityClass"
          >
            {{ visibilityLabel }}
          </span>
        </div>

        <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ course.description }}</p>

        <div class="flex items-center gap-3 text-xs text-gray-400">
          <span class="flex items-center gap-1">
            <Layers class="h-3 w-3" />
            {{ course.lessons?.length || 0 }} уроков
          </span>
          <span class="flex items-center gap-1">
            <Eye class="h-3 w-3" />
            {{ course.courseProgress?.length || 0 }} студентов
          </span>
        </div>
      </div>

      <!-- Кнопка редактирования -->
      <button
        @click.stop="$emit('edit')"
        class="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors shrink-0"
      >
        <Edit class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BookOpen, Layers, Star, Eye, Edit } from "@lucide/vue";
import type { Course } from "@/types/course";
import { CourseVisibilityTypes } from "@/types/enums/course-visibility-types";

const props = defineProps<{
  course: Course;
}>();

defineEmits<{
  click: [];
  edit: [];
}>();

const visibilityLabel = computed(() => {
  const labels: Record<string, string> = {
    [CourseVisibilityTypes.PUBLISHED]: "Опубликован",
    [CourseVisibilityTypes.DRAFT]: "Черновик",
    [CourseVisibilityTypes.ORGANIZATION]: "Для организации",
  };
  return labels[props.course.visibility] || props.course.visibility;
});

const visibilityClass = computed(() => {
  const classes: Record<string, string> = {
    [CourseVisibilityTypes.PUBLISHED]: "bg-emerald-500/10 text-emerald-600",
    [CourseVisibilityTypes.DRAFT]: "bg-amber-500/10 text-amber-600",
    [CourseVisibilityTypes.ORGANIZATION]: "bg-accent-cyan/10 text-accent-cyan",
  };
  return classes[props.course.visibility] || "bg-gray-100 text-gray-600";
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
