<template>
  <div
    class="glass rounded-2xl overflow-hidden card-hover animate-fadeInUp"
    :style="{ animationDelay: `${delay}s` }"
  >
    <!-- Шапка с градиентом -->
    <div class="h-40 relative overflow-hidden">
      <div class="absolute inset-0 shimmer"></div>
      <div
        class="absolute inset-0"
        :style="{
          background: `linear-gradient(135deg, ${courseColor.from}, ${courseColor.to})`,
        }"
      ></div>

      <!-- Бейджи -->
      <div class="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
        <div
          class="px-2.5 py-1 rounded-lg bg-white/90 text-xs font-medium text-gray-700 shadow-sm"
        >
          {{ mapCourseLevel(course.level.toString()) }}
        </div>
        <div
          v-if="course.organization"
          class="px-2.5 py-1 rounded-lg bg-accent/90 text-white text-xs font-medium shadow-sm flex items-center gap-1"
        >
          <Building2 class="w-3 h-3" />
          Организация
        </div>
      </div>

      <!-- Цена -->
      <div
        v-if="!course.isFree"
        class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-primary/90 text-white text-xs font-medium shadow-sm"
      >
        {{ formatPrice(course.price) }}
      </div>
      <div
        v-else
        class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-medium shadow-sm"
      >
        Бесплатно
      </div>
    </div>

    <div class="p-5">
      <!-- Мета-информация -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <Users class="w-3.5 h-3.5" />
            {{ formatNumber(course.userCourseProgresses?.length || 0) }}
          </div>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <BookOpen class="w-3.5 h-3.5" />
            {{ course.lessons?.length || 0 }} уроков
          </div>
        </div>
        <!-- Рейтинг -->
      </div>

      <!-- Название и описание -->
      <h3 class="font-semibold text-gray-800 mb-2 line-clamp-1">
        {{ course.title }}
      </h3>
      <p class="text-sm text-gray-500 mb-4 line-clamp-2">
        {{ course.description || "Описание отсутствует" }}
      </p>

      <!-- Создатель -->
      <div class="flex items-center gap-2 mb-3">
        <div class="relative">
          <img
            :src="course.user?.avatarUrl || '/placeholder-avatar.png'"
            :alt="course.user?.login"
            class="w-6 h-6 rounded-full object-cover"
          />
          <div
            v-if="course.organization"
            class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent flex items-center justify-center"
          >
            <Building2 class="w-2 h-2 text-white" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <span class="text-xs text-gray-500">Создатель:</span>
            <span class="text-xs font-medium text-gray-700 truncate">
              {{ course.user?.login || "Неизвестный автор" }}
            </span>
          </div>
          <div v-if="course.organization" class="flex items-center gap-1">
            <span class="text-xs text-gray-400">в</span>
            <span class="text-xs text-accent truncate">
              {{ course.organization.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-1 text-xs text-gray-400">
          <Calendar class="w-3.5 h-3.5" />
          {{ formatDate(course.createdAt) }}
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-400">
          <Clock class="w-3.5 h-3.5" />
          {{ totalDuration }}
        </div>
      </div>

      <!-- Категории/теги -->
      <div v-if="course.courseTerms?.length" class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="term in course.courseTerms.slice(0, 3)"
          :key="term.id"
          class="px-2 py-0.5 rounded-md text-xs"
          :class="
            term.type === 'CATEGORY'
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-600'
          "
        >
          {{ term.name }}
        </span>
        <span
          v-if="course.courseTerms.length > 3"
          class="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs"
        >
          +{{ course.courseTerms.length - 3 }}
        </span>
      </div>

      <!-- Прогресс (если есть) -->
      <div v-if="userProgress" class="mb-4">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-gray-500">Ваш прогресс</span>
          <span class="text-xs font-medium text-primary">
            {{ Math.round(userProgress.progress) }}%
          </span>
        </div>
        <div class="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 bg-linear-to-r from-primary to-accent rounded-full transition-all duration-500"
            :style="{ width: `${userProgress.progress}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-1.5">
          {{ userProgress.completedLessonsCount }} / {{ userProgress.totalLessons }}
          уроков пройдено
        </p>
      </div>

      <!-- Кнопка -->
      <router-link
        :to="{ name: 'single-course-page', params: { id: course.id } }"
        class="btn-primary w-full py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5"
      >
        <Eye class="w-4 h-4" />
        {{ userProgress ? "Продолжить" : "Подробнее" }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Users, Star, Clock, Eye, BookOpen, Calendar, Building2 } from "@lucide/vue";
import { CourseLevels } from "@/types/enums/course-levels";
import type { Course } from "@/types/course";
import { useAuthStore } from "@/stores/auth";
import { mapCourseLevel } from "@/utils/mappers/mapCourseLevel";
import { formatDate } from "@/utils/formatters/formatDate";

const props = defineProps<{
  course: Course;
  delay?: number;
}>();

const authStore = useAuthStore();

const userProgress = computed(() => {
  if (!authStore.currentUser) return null;
  return props.course.userCourseProgresses?.find(
    (p) => p.userId === authStore.currentUser?.id
  );
});

const totalDuration = computed(() => {
  const totalMinutes =
    props.course.lessons?.reduce((sum, lesson) => sum + lesson.requredTime, 0) || 0;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} мин`;
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
});

const formatPrice = (price: number): string => {
  if (price === 0) return "Бесплатно";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

const courseColor = computed(() => {
  const level = props.course.level?.toString().toUpperCase() || "";

  const colors: Record<string, { from: string; to: string }> = {
    BEGINNER: { from: "#67e8f9", to: "#6366f1" },
    INTERMEDIATE: { from: "#6366f1", to: "#a78bfa" },
    ADVANCED: { from: "#a78bfa", to: "#f472b6" },
    PROFESSIONAL: { from: "#f472b6", to: "#ef4444" },
  };

  console.log("Course level raw:", props.course.level);
  console.log("Course level normalized:", level);
  console.log("Available colors keys:", Object.keys(colors));
  console.log("Matched color:", colors[level]);

  return colors[level] || { from: "#6366f1", to: "#a78bfa" };
});
</script>

<style scoped>
.shimmer {
  background: linear-gradient(
    90deg,
    transparent 30%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
