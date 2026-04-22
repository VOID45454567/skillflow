<!-- components/course/OrganizationCourseCard.vue -->
<template>
  <div class="glass rounded-xl p-4 card-hover cursor-pointer" @click="$emit('click')">
    <div class="flex items-start gap-4">
      <!-- Градиентный блок -->
      <div
        class="h-16 w-16 rounded-xl shrink-0 flex items-center justify-center"
        :style="{
          background: `linear-gradient(135deg, ${courseColor.from}, ${courseColor.to})`,
        }"
      >
        <BookOpen class="h-6 w-6 text-white" />
      </div>

      <!-- Информация -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-semibold text-gray-800 truncate">{{ course.title }}</h3>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
            :class="
              course.isFree
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-primary/10 text-primary'
            "
          >
            {{ course.isFree ? "Бесплатно" : formatPrice(course.price) }}
          </span>
        </div>

        <p class="text-sm text-gray-500 line-clamp-2 mb-2">
          {{ course.description || "Описание отсутствует" }}
        </p>

        <!-- Мета-информация -->
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-1">
            <BookOpen class="h-3.5 w-3.5" />
            {{ course.lessons?.length || 0 }} уроков
          </div>
          <div class="flex items-center gap-1">
            <Users class="h-3.5 w-3.5" />
            {{ formatNumber(course.userCourseProgresses?.length || 0) }}
          </div>
        </div>

        <!-- Прогресс -->
        <div v-if="progress" class="mt-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-gray-500">
              {{ progress.progress >= 100 ? "Завершен" : "Прогресс" }}
            </span>
            <span
              class="text-xs font-medium"
              :class="progress.progress >= 100 ? 'text-emerald-600' : 'text-primary'"
            >
              {{ Math.round(progress.progress) }}%
            </span>
          </div>
          <div class="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute inset-y-0 left-0 rounded-full transition-all"
              :class="progress.progress >= 100 ? 'bg-emerald-500' : 'bg-primary'"
              :style="{ width: `${progress.progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Кнопки для владельца -->
        <div v-if="isOwner" class="flex items-center gap-2 mt-3">
          <button
            @click.stop="$emit('edit', course.id)"
            class="text-xs text-primary hover:text-primary-dark transition-colors"
          >
            Редактировать
          </button>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          v-if="isOwner"
          @click.stop="$emit('edit', course.id)"
          class="p-2 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <Edit class="h-4 w-4 text-gray-400" />
        </button>
        <ChevronRight class="h-5 w-5 text-gray-400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BookOpen, Users, ChevronRight, Edit } from "@lucide/vue";
import { CourseLevels } from "@/types/enums/course-levels";
import type { Course } from "@/types/course";
import type { UserCourseProgress } from "@/types/userCourseProgress";

const props = defineProps<{
  course: Course;
  progress?: UserCourseProgress | null;
  isOwner?: boolean;
}>();

defineEmits<{
  click: [];
  edit: [courseId: number];
}>();

const courseColor = computed(() => {
  const level = props.course.level?.toString().toUpperCase() || "";
  const colors: Record<string, { from: string; to: string }> = {
    BEGINNER: { from: "#67e8f9", to: "#6366f1" },
    INTERMEDIATE: { from: "#6366f1", to: "#a78bfa" },
    ADVANCED: { from: "#a78bfa", to: "#f472b6" },
    PROFESSIONAL: { from: "#f472b6", to: "#ef4444" },
  };
  return colors[level] || { from: "#6366f1", to: "#a78bfa" };
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatNumber = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
