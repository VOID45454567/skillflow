<template>
  <div
    class="glass rounded-2xl p-4 sm:p-5 card-hover animate-fadeInUp cursor-pointer"
    :style="{ animationDelay: `${delay}s` }"
    @click="goToCourse"
  >
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Thumbnail -->
      <div class="sm:w-48 h-32 rounded-xl overflow-hidden relative shrink-0">
        <div class="absolute inset-0 shimmer"></div>
        <div
          class="absolute inset-0"
          :style="`background: linear-gradient(135deg, ${
            course.colorGradient?.from || '#6366f1'
          }, ${course.colorGradient?.to || '#a78bfa'});`"
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
              <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {{ course.category }}
              </span>
              <span class="text-xs text-gray-400 hidden sm:inline">•</span>
              <span class="text-xs text-gray-400 flex items-center gap-1">
                <Users class="w-3 h-3" />
                {{ course.studentsCount || 0 }}
              </span>
              <span class="text-xs text-gray-400 hidden sm:inline">•</span>
              <span class="text-xs text-gray-400">
                {{ getLevelLabel(course.level) }}
              </span>
            </div>

            <h3 class="font-semibold text-gray-800 mb-1 line-clamp-1">
              {{ course.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-3 line-clamp-2">
              {{ course.description }}
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
          <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500">
            <span class="flex items-center gap-1">
              <Clock class="w-4 h-4" />
              {{ course.duration }}ч
            </span>
            <span class="flex items-center gap-1">
              <Layers class="w-4 h-4" />
              {{ course.lessons?.length || 0 }} уроков
            </span>
            <div v-if="course.tags?.length" class="flex flex-wrap gap-1">
              <span
                v-for="tag in course.tags.slice(0, 2)"
                :key="tag"
                class="px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-500"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <button
            class="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1 sm:w-auto w-full hover:shadow-lg transition-all duration-300"
          >
            <Eye class="w-4 h-4" />
            Подробнее
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { BookOpen, Users, Star, Clock, Layers, Eye } from '@lucide/vue'

const props = defineProps<{
  course: any
  delay?: number
}>()

const router = useRouter()

const getLevelLabel = (level?: string): string => {
  const levels: Record<string, string> = {
    BEGINNER: 'Начинающий',
    INTERMEDIATE: 'Средний',
    ADVANCED: 'Продвинутый',
    PROFESSIONAL: 'Профессиональный',
  }
  return levels[level || 'BEGINNER'] || 'Начинающий'
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

const goToCourse = () => {
  router.push({ name: 'single-course-page', params: { id: props.course.id } })
}
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

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
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

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-accent, #a78bfa));
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
</style>
