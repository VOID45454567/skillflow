<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-40">
        <Loader class="h-12 w-12 text-primary animate-spin" />
      </div>

      <!-- Course Content -->
      <template v-else-if="course && currentLesson">
        <!-- Header -->
        <div class="mb-6">
          <button
            @click="goBack"
            class="p-2 rounded-xl glass hover:bg-surface-hover transition-all group mb-4"
          >
            <ArrowLeft class="h-5 w-5 text-gray-600 group-hover:text-primary" />
          </button>

          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{{ course.title }}</h1>
              <p class="text-gray-500">{{ course.description }}</p>
            </div>

            <!-- Progress -->
            <div class="text-right">
              <p class="text-sm text-gray-500">Прогресс курса</p>
              <p class="text-2xl font-bold text-primary">
                {{ Math.round(progress?.progress || 0) }}%
              </p>
              <p class="text-xs text-gray-400">
                {{ progress?.completedLessonsCount || 0 }} /
                {{ progress?.totalLessons || 0 }} уроков
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
              :style="{ width: `${progress?.progress || 0}%` }"
            ></div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Lesson Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Current Lesson Info -->
            <div class="glass-strong rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-sm text-gray-500">
                    Урок {{ currentLessonIndex + 1 }} из {{ totalLessons }}
                  </span>
                  <h2 class="text-xl font-bold text-gray-800 mt-1">
                    {{ currentLesson.title }}
                  </h2>
                </div>

                <span
                  v-if="isLessonCompleted(currentLesson)"
                  class="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium"
                >
                  Пройден
                </span>
              </div>

              <!-- Lesson Goals -->
              <div v-if="currentLesson.goals?.length" class="mb-6">
                <h3 class="text-sm font-medium text-gray-600 mb-2">Цели урока:</h3>
                <ul class="space-y-1">
                  <li
                    v-for="(goal, idx) in currentLesson.goals"
                    :key="idx"
                    class="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Target class="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {{ goal }}
                  </li>
                </ul>
              </div>

              <!-- Lesson Content Sections -->
              <div class="space-y-6">
                <div
                  v-for="(section, idx) in currentLesson.content?.sections || []"
                  :key="idx"
                >
                  <!-- Text Section -->
                  <div v-if="section.type === 'text'" class="prose prose-sm max-w-none">
                    <div v-html="section.content"></div>
                  </div>

                  <!-- Media Section -->
                  <div v-else-if="section.type === 'media'" class="space-y-2">
                    <img
                      :src="section.url"
                      :alt="section.altText"
                      class="rounded-xl max-w-full"
                    />
                    <p v-if="section.caption" class="text-sm text-gray-500 text-center">
                      {{ section.caption }}
                    </p>
                  </div>

                  <!-- Code Section -->
                  <div v-else-if="section.type === 'code'" class="space-y-3">
                    <p v-if="section.description" class="text-sm text-gray-600">
                      {{ section.description }}
                    </p>
                    <div class="relative">
                      <pre
                        class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto"
                      ><code>{{ section.code }}</code></pre>
                      <span class="absolute top-2 right-2 text-xs text-gray-400">
                        {{ section.language }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lesson Navigation -->
              <div
                class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200"
              >
                <button
                  v-if="prevLesson"
                  @click="goToLesson(prevLesson)"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-surface-hover transition-all"
                >
                  <ArrowLeft class="h-4 w-4" />
                  <span>Предыдущий урок</span>
                </button>
                <div v-else></div>

                <div class="flex gap-3">
                  <button
                    v-if="!isLessonCompleted(currentLesson)"
                    @click="handleCompleteLesson"
                    :disabled="isCompleting"
                    class="btn-primary px-6 py-2 rounded-xl text-white font-medium flex items-center gap-2"
                  >
                    <Loader v-if="isCompleting" class="h-4 w-4 animate-spin" />
                    <CheckCircle v-else class="h-4 w-4" />
                    {{ isCompleting ? "Сохранение..." : "Завершить урок" }}
                  </button>

                  <button
                    v-if="nextLesson"
                    @click="goToLesson(nextLesson)"
                    :disabled="!canProceedToNext"
                    class="flex items-center gap-2 px-6 py-2 rounded-xl glass hover:bg-surface-hover transition-all"
                    :class="{ 'opacity-50 cursor-not-allowed': !canProceedToNext }"
                  >
                    <span>Следующий урок</span>
                    <ArrowRight class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Lessons List -->
            <div class="glass-strong rounded-2xl p-6">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen class="h-5 w-5 text-primary" />
                Содержание курса
              </h3>

              <div class="space-y-2">
                <div
                  v-for="(lesson, index) in sortedLessons"
                  :key="lesson.id"
                  @click="goToLesson(lesson)"
                  class="p-3 rounded-xl cursor-pointer transition-all"
                  :class="{
                    'bg-primary/10 border-l-4 border-primary':
                      lesson.id === currentLesson.id,
                    'hover:bg-gray-100':
                      lesson.id !== currentLesson.id && !isLessonLocked(lesson, index),
                    'opacity-50 cursor-not-allowed': isLessonLocked(lesson, index),
                  }"
                >
                  <div class="flex items-start gap-3">
                    <div class="shrink-0">
                      <CheckCircle
                        v-if="isLessonCompleted(lesson)"
                        class="h-5 w-5 text-emerald-500"
                      />
                      <Lock
                        v-else-if="isLessonLocked(lesson, index)"
                        class="h-5 w-5 text-gray-400"
                      />
                      <div
                        v-else
                        class="h-5 w-5 rounded-full border-2"
                        :class="
                          lesson.id === currentLesson.id
                            ? 'border-primary bg-primary/20'
                            : 'border-gray-300'
                        "
                      ></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-medium truncate"
                        :class="
                          lesson.id === currentLesson.id
                            ? 'text-primary'
                            : isLessonCompleted(lesson)
                            ? 'text-emerald-600'
                            : 'text-gray-700'
                        "
                      >
                        {{ index + 1 }}. {{ lesson.title }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ lesson.requredTime || 0 }} мин
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Course Info -->
            <div class="glass rounded-2xl p-6">
              <h3 class="font-semibold text-gray-800 mb-3">О курсе</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Уровень</span>
                  <span class="font-medium">{{
                    mapCourseLevel(course.level.toString())
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Уроков</span>
                  <span class="font-medium">{{ totalLessons }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Автор</span>
                  <span class="font-medium">{{ course.user?.login }}</span>
                </div>
              </div>
            </div>

            <!-- Complete Course Button -->
            <button
              v-if="progress && progress.progress === 100 && !progress.completedAt"
              @click="handleCompleteCourse"
              :disabled="isCompletingCourse"
              class="w-full py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <Loader v-if="isCompletingCourse" class="h-5 w-5 animate-spin" />
              <Trophy v-else class="h-5 w-5" />
              {{ isCompletingCourse ? "Завершение..." : "Завершить курс" }}
            </button>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <div v-else class="text-center py-20">
        <AlertCircle class="h-16 w-16 mx-auto mb-4 text-rose-400" />
        <h2 class="text-xl font-bold text-gray-800 mb-2">Курс не найден</h2>
        <button @click="goBack" class="text-primary hover:underline">
          Вернуться назад
        </button>
      </div>
    </div>

    <!-- Course Completed Modal -->
    <CompletionModal
      v-model="showCompletionModal"
      :course-title="course?.title || ''"
      @continue="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  ArrowRight,
  Loader,
  Target,
  BookOpen,
  CheckCircle,
  Lock,
  Trophy,
  AlertCircle,
} from "@lucide/vue";
import { useCoursesStore } from "@/stores/courses";
import { useUserCourseProgressStore } from "@/stores/userCourseProgress";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import CompletionModal from "@/components/course/CompletionModal.vue";
import { mapCourseLevel } from "@/utils/mappers/mapCourseLevel";
import type { Lesson } from "@/types/course/Lesson";
import type { UserCourseProgress } from "@/types/userCourseProgress";

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();
const progressStore = useUserCourseProgressStore();
const authStore = useAuthStore();
const toast = useToast();

const courseId = Number(route.params.id);
const isLoading = ref(true);
const isCompleting = ref(false);
const isCompletingCourse = ref(false);
const showCompletionModal = ref(false);

const course = computed(() => coursesStore.currentCourse);
const progress = ref<UserCourseProgress | null>(null);
const currentUser = computed(() => authStore.currentUser);

const sortedLessons = computed(() => {
  return [...(course.value?.lessons || [])].sort((a, b) => a.order - b.order);
});

const totalLessons = computed(() => sortedLessons.value.length);

// Определяем текущий урок
const currentLesson = ref<Lesson | null>(null);
const currentLessonIndex = computed(() => {
  if (!currentLesson.value) return 0;
  return sortedLessons.value.findIndex((l) => l.id === currentLesson.value!.id);
});

const prevLesson = computed(() => {
  if (currentLessonIndex.value <= 0) return null;
  return sortedLessons.value[currentLessonIndex.value - 1];
});

const nextLesson = computed(() => {
  if (currentLessonIndex.value >= totalLessons.value - 1) return null;
  return sortedLessons.value[currentLessonIndex.value + 1];
});

// Можно ли перейти к следующему уроку
const canProceedToNext = computed(() => {
  if (!nextLesson.value) return false;
  return isLessonCompleted(currentLesson.value!);
});

// Проверка завершен ли урок
function isLessonCompleted(lesson: Lesson): boolean {
  if (!progress.value?.completedLessonsList) return false;
  return progress.value.completedLessonsList.includes(lesson.id);
}

// Проверка заблокирован ли урок
function isLessonLocked(lesson: Lesson, index: number): boolean {
  if (!progress.value) return index !== 0;
  if (index === 0) return false;
  const prevLesson = sortedLessons.value[index - 1];
  return !isLessonCompleted(prevLesson);
}

// Определение текущего урока при загрузке
function determineCurrentLesson(progressData: UserCourseProgress | null): Lesson {
  if (!sortedLessons.value.length) {
    throw new Error("No lessons in course");
  }

  // Если есть прогресс и currentLessonId - используем его
  if (progressData?.currentLessonId) {
    const lesson = sortedLessons.value.find((l) => l.id === progressData.currentLessonId);
    if (lesson) return lesson;
  }

  // Иначе ищем первый незавершенный урок
  const firstIncomplete = sortedLessons.value.find((l) => !isLessonCompleted(l));
  if (firstIncomplete) return firstIncomplete;

  return sortedLessons.value[sortedLessons.value.length - 1];
}

function goToLesson(lesson: Lesson) {
  const index = sortedLessons.value.findIndex((l) => l.id === lesson.id);
  if (isLessonLocked(lesson, index)) {
    toast.info("");
    return;
  }
  currentLesson.value = lesson;
}

// Загрузка данных
async function loadData() {
  isLoading.value = true;
  try {
    // Загружаем курс
    await coursesStore.getCourseById(courseId);

    // Проверяем доступ
    const isOwner = course.value?.userId === currentUser.value?.id;
    const isPurchased =
      currentUser.value?.purchasedCourses?.some((c) => c.id === courseId) || false;
    const hasAccess = isOwner || course.value?.isFree || isPurchased;

    if (!hasAccess) {
      toast.error("У вас нет доступа к этому курсу");
      router.push({ name: "single-course-page", params: { id: courseId } });
      return;
    }

    // Загружаем прогресс
    await progressStore.fetchMyProgress();

    // Получаем прогресс для этого курса
    let courseProgress = progressStore.getCourseProgress(courseId);

    if (!courseProgress && !isOwner) {
      courseProgress = await progressStore.startCourse(courseId);
    }

    progress.value = courseProgress || null;

    // Определяем текущий урок
    if (sortedLessons.value.length > 0) {
      currentLesson.value = determineCurrentLesson(progress.value);
    }
  } catch (error) {
    console.error("Error loading course:", error);
    toast.error("Не удалось загрузить курс");
  } finally {
    isLoading.value = false;
  }
}

// Завершение урока
async function handleCompleteLesson() {
  if (!currentLesson.value) return;

  // Проверяем, не завершен ли уже урок
  if (isLessonCompleted(currentLesson.value)) {
    toast.info("Урок уже завершен");
    return;
  }

  isCompleting.value = true;
  try {
    await progressStore.completeLesson(currentLesson.value.id);

    // Обновляем прогресс
    await progressStore.fetchMyProgress();
    progress.value = progressStore.getCourseProgress(courseId) || null;

    toast.success("Урок завершен!", "Прогресс сохранен");

    // Проверяем завершение курса
    if (progress.value?.progress === 100 && !progress.value.completedAt) {
      // Автоматически завершаем курс
      await handleCompleteCourse();
    } else if (nextLesson.value) {
      // Переходим к следующему уроку
      currentLesson.value = nextLesson.value;
    }
  } catch (error: any) {
    console.error("Error completing lesson:", error);
    toast.error(
      "Ошибка при завершении урока",
      error?.response?.data?.message || "Попробуйте позже"
    );
  } finally {
    isCompleting.value = false;
  }
}

// Завершение курса
async function handleCompleteCourse() {
  if (!progress.value || progress.value.progress < 100) {
    toast.error("Не все уроки завершены");
    return;
  }

  isCompletingCourse.value = true;
  try {
    await progressStore.completeCourse(courseId);
    await progressStore.fetchMyProgress();
    progress.value = progressStore.getCourseProgress(courseId) || null;

    showCompletionModal.value = true;
  } catch (error: any) {
    console.error("Error completing course:", error);
    toast.error(
      "Ошибка при завершении курса",
      error?.response?.data?.message || "Попробуйте позже"
    );
  } finally {
    isCompletingCourse.value = false;
  }
}

function goBack() {
  router.push({ name: "single-course-page", params: { id: courseId } });
}

onMounted(() => {
  loadData();
});

// Следим за изменением прогресса
watch(
  () => progress.value?.progress,
  (newProgress) => {
    if (newProgress === 100 && !progress.value?.completedAt) {
      // Можно показать уведомление
    }
  }
);
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose :deep(p) {
  margin-bottom: 1em;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose :deep(code) {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.9em;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
