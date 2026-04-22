<template>
  <div class="glass-strong rounded-3xl p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <BookOpen class="h-5 w-5 text-primary" />
        <h3 class="text-lg font-bold text-gray-800">Мои курсы</h3>
      </div>
      <router-link
        :to="{ name: 'create-course' }"
        class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        <Plus class="h-4 w-4" />
        Создать
      </router-link>
    </div>

    <div class="grid grid-cols-3 gap-3 mb-4">
      <div
        class="glass rounded-xl p-3 text-center cursor-pointer hover:bg-surface-hover transition-all"
        @click="navigateToCourses('created')"
      >
        <div class="text-2xl font-bold text-primary">{{ createdCourses.length }}</div>
        <p class="text-xs text-gray-500">Созданных</p>
      </div>
      <div
        class="glass rounded-xl p-3 text-center cursor-pointer hover:bg-surface-hover transition-all"
        @click="navigateToCourses('purchased')"
      >
        <div class="text-2xl font-bold text-accent">{{ purchasedCourses.length }}</div>
        <p class="text-xs text-gray-500">Купленных</p>
      </div>
      <div
        class="glass rounded-xl p-3 text-center cursor-pointer hover:bg-surface-hover transition-all"
        @click="navigateToCourses('active')"
      >
        <div class="text-2xl font-bold text-accent-cyan">{{ activeCoursesCount }}</div>
        <p class="text-xs text-gray-500">В процессе</p>
      </div>
    </div>

    <!-- Кнопки быстрого перехода -->
    <div class="flex gap-2">
      <button
        @click="navigateToCourses('created')"
        class="flex-1 py-2 rounded-lg bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
      >
        <Award class="h-4 w-4" />
        Мои курсы
      </button>
      <button
        @click="navigateToCourses('purchased')"
        class="flex-1 py-2 rounded-lg bg-accent/5 text-accent text-sm font-medium hover:bg-accent/10 transition-colors flex items-center justify-center gap-1"
      >
        <ShoppingBag class="h-4 w-4" />
        Купленные
      </button>
      <button
        @click="navigateToCourses('active')"
        class="flex-1 py-2 rounded-lg bg-accent-cyan/5 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/10 transition-colors flex items-center justify-center gap-1"
      >
        <PlayCircle class="h-4 w-4" />
        Прохожу
      </button>
    </div>

    <!-- Превью активных курсов (в процессе) -->
    <div v-if="activeCourses.length > 0" class="mt-4 pt-4 border-t border-gray-200/60">
      <p class="text-xs font-medium text-gray-500 mb-2">Продолжить обучение</p>
      <div class="space-y-2">
        <div
          v-for="progress in activeCourses.slice(0, 2)"
          :key="progress.courseId"
          class="glass rounded-xl p-3 hover:bg-surface-hover transition-all cursor-pointer"
          @click="goToCourse(progress.courseId)"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-10 w-10 rounded-lg bg-linear-to-br from-accent-cyan/20 to-primary/20 flex items-center justify-center shrink-0"
            >
              <PlayCircle class="h-5 w-5 text-accent-cyan" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-800 truncate">
                  {{ getCourseTitle(progress.courseId) }}
                </span>
                <span class="text-xs font-semibold text-accent-cyan ml-2 shrink-0">
                  {{ Math.round(progress.progress) }}%
                </span>
              </div>
              <div class="relative h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                <div
                  class="absolute inset-y-0 left-0 bg-linear-to-r from-accent-cyan to-primary rounded-full transition-all duration-500"
                  :style="{ width: `${progress.progress}%` }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1.5">
                {{ progress.completedLessonsCount }} / {{ progress.totalLessons }} уроков
              </p>
            </div>
            <ChevronRight class="h-4 w-4 text-gray-400 shrink-0" />
          </div>
        </div>
      </div>
      <button
        v-if="activeCourses.length > 2"
        @click="navigateToCourses('active')"
        class="w-full mt-2 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
      >
        + ещё {{ activeCourses.length - 2 }}
        {{ pluralize(activeCourses.length - 2, "курс", "курса", "курсов") }}
      </button>
    </div>

    <!-- Превью последних созданных курсов -->
    <div v-if="createdCourses.length > 0" class="mt-4 pt-4 border-t border-gray-200/60">
      <p class="text-xs font-medium text-gray-500 mb-2">Последние созданные</p>
      <div class="space-y-2">
        <div
          v-for="course in createdCourses.slice(0, 2)"
          :key="course.id"
          class="flex items-center justify-between p-2 bg-white/40 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
          @click="goToCourse(course.id)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0"
            >
              <BookOpen class="h-4 w-4 text-primary" />
            </div>
            <span class="text-sm text-gray-700 truncate">{{ course.title }}</span>
          </div>
          <ChevronRight class="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <button
        v-if="createdCourses.length > 2"
        @click="navigateToCourses('created')"
        class="w-full mt-2 text-xs text-primary hover:text-primary-dark transition-colors"
      >
        + ещё {{ createdCourses.length - 2 }}
        {{ pluralize(createdCourses.length - 2, "курс", "курса", "курсов") }}
      </button>
    </div>

    <div v-if="purchasedCourses.length > 0" class="mt-4 pt-4 border-t border-gray-200/60">
      <p class="text-xs font-medium text-gray-500 mb-2">Последние купленные</p>
      <div class="space-y-2">
        <div
          v-for="course in purchasedCourses.slice(0, 2)"
          :key="course.id"
          class="flex items-center justify-between p-2 bg-white/40 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
          @click="goToCourse(course.id)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="w-8 h-8 rounded-lg bg-linear-to-br from-accent/20 to-accent-pink/20 flex items-center justify-center shrink-0"
            >
              <ShoppingBag class="h-4 w-4 text-accent" />
            </div>
            <span class="text-sm text-gray-700 truncate">{{ course.title }}</span>
          </div>
          <ChevronRight class="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <button
        v-if="purchasedCourses.length > 2"
        @click="navigateToCourses('purchased')"
        class="w-full mt-2 text-xs text-accent hover:text-accent/80 transition-colors"
      >
        + ещё {{ purchasedCourses.length - 2 }}
        {{ pluralize(purchasedCourses.length - 2, "курс", "курса", "курсов") }}
      </button>
    </div>

    <div
      v-if="!createdCourses.length && !purchasedCourses.length"
      class="text-center py-6 text-gray-500"
    >
      <BookOpen class="h-12 w-12 mx-auto mb-3 text-gray-300" />
      <p class="font-medium">У вас пока нет курсов</p>
      <div class="flex items-center justify-center gap-4 mt-3">
        <router-link
          :to="{ name: 'public-courses' }"
          class="text-primary hover:underline text-sm"
        >
          Перейти в каталог
        </router-link>
        <span class="text-gray-300">|</span>
        <router-link
          :to="{ name: 'create-course' }"
          class="text-primary hover:underline text-sm"
        >
          Создать свой
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Course } from "@/types/course";
import type { User } from "@/types/user";
import {
  BookOpen,
  Plus,
  Award,
  ShoppingBag,
  PlayCircle,
  ChevronRight,
} from "@lucide/vue";

const props = defineProps<{
  createdCourses: Course[];
  purchasedCourses: Course[];
  user: User;
}>();

const router = useRouter();

const activeCourses = computed(() => {
  return (
    props.user.userCourseProgresses?.filter(
      (p) => p.completedAt === null && p.progress < 100
    ) || []
  );
});

const activeCoursesCount = computed(() => activeCourses.value.length);

function getCourseTitle(courseId: number): string {
  const created = props.createdCourses.find((c) => c.id === courseId);
  if (created) return created.title;

  const purchased = props.purchasedCourses.find((c) => c.id === courseId);
  if (purchased) return purchased.title;

  return "Курс";
}

// Склонение слов
function pluralize(count: number, one: string, two: string, five: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
  return five;
}

type CourseTab = "created" | "purchased" | "active";

const navigateToCourses = (tab: CourseTab) => {
  router.push({
    name: "my-courses",
    query: { tab },
  });
};

const goToCourse = (courseId: number) => {
  router.push({ name: "single-course-page", params: { id: courseId } });
};
</script>
