<template>
  <div
    class="glass rounded-2xl p-4 sm:p-5 card-hover animate-fadeInUp"
    :style="{ animationDelay: `${delay}s` }"
  >
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Thumbnail -->
      <div class="sm:w-48 h-32 rounded-xl overflow-hidden relative shrink-0">
        <div class="absolute inset-0 shimmer"></div>
        <div
          class="absolute inset-0"
          :style="`background: linear-gradient(135deg, ${getGradient((course as any).level).from}, ${getGradient((course as any).level).to});`"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <BookOpen class="w-8 h-8 text-white/50" />
        </div>
        <div
          v-if="!course.isFree && course.price"
          class="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-primary/90 text-white text-xs font-medium"
        >
          {{ formatPrice(course.price) }}
        </div>
        <div
          v-else-if="course.isFree"
          class="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-500/90 text-white text-xs font-medium"
        >
          Бесплатно
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span
                class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
              >
                {{ getCategory(course) }}
              </span>
              <span class="text-xs text-gray-400 hidden sm:inline">•</span>
              <span class="text-xs text-gray-400 flex items-center gap-1">
                <Users class="w-3 h-3" />
                {{ (course as any).studentsCount || 0 }}
              </span>
              <span class="text-xs text-gray-400 hidden sm:inline">•</span>
              <span class="text-xs text-gray-400">
                {{ getLevelLabel((course as any).level) }}
              </span>
            </div>

            <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1">
              {{ course.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-3 line-clamp-2">
              {{ course.description }}
            </p>
          </div>

          <div class="sm:text-right shrink-0">
            <div class="flex items-center gap-1 text-amber-500 sm:justify-end">
              <Star class="w-4 h-4 fill-current" />
              <span
                class="text-sm font-medium"
                >{{ ((course as any).rating || 0).toFixed(1) }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
          <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <Clock class="w-4 h-4" />
              {{ getDuration(course) }}ч
            </span>
            <span class="flex items-center gap-1">
              <Layers class="w-4 h-4" />
              {{ course.lessons?.length || 0 }} уроков
            </span>
            <div v-if="getTags(course).length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tag in getTags(course).slice(0, 2)"
                :key="tag"
                class="px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-500"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <router-link
            :to="{ name: 'single-course-page', params: { id: course.id } }"
            class="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1 sm:w-auto w-full"
          >
            <Eye class="w-4 h-4" />
            Подробнее
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from "@/types/course";
import { BookOpen, Users, Star, Clock, Layers, Eye } from "@lucide/vue";

const props = defineProps<{
  course: Course;
  delay?: number;
}>();

const getGradient = (level?: string) => {
  const gradients: Record<string, { from: string; to: string }> = {
    BEGINNER: { from: "#67e8f9", to: "#6366f1" },
    INTERMEDIATE: { from: "#6366f1", to: "#a78bfa" },
    ADVANCED: { from: "#a78bfa", to: "#f472b6" },
    PROFESSIONAL: { from: "#f472b6", to: "#ef4444" },
  };
  return gradients[level || "BEGINNER"] || { from: "#6366f1", to: "#a78bfa" };
};

const getCategory = (course: Course): string => {
  const categoryTerm = course.courseTerms?.find((t: any) => t.type === "CATEGORY");
  return categoryTerm?.name || "Программирование";
};

const getTags = (course: Course): string[] => {
  return (
    course.courseTerms?.filter((t: any) => t.type === "TAG").map((t: any) => t.name) || []
  );
};

const getLevelLabel = (level?: string): string => {
  const levels: Record<string, string> = {
    BEGINNER: "Начинающий",
    INTERMEDIATE: "Средний",
    ADVANCED: "Продвинутый",
    PROFESSIONAL: "Профессиональный",
  };
  return levels[level || "BEGINNER"] || "Начинающий";
};

const getDuration = (course: Course): number => {
  const totalMinutes =
    course.lessons?.reduce((acc: number, l: any) => acc + (l.requredTime || 0), 0) || 0;
  return Math.ceil(totalMinutes / 60);
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};
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
