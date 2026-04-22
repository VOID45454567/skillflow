<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between animate-fadeInUp">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Мои курсы</h1>
          <p class="text-gray-500">Управляйте вашими курсами и отслеживайте прогресс</p>
        </div>
        <router-link
          :to="{ name: 'create-course' }"
          class="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus class="h-4 w-4" />
          Создать курс
        </router-link>
      </div>

      <!-- Tabs -->
      <div
        class="glass rounded-2xl p-1 flex gap-1 animate-fadeInUp"
        style="animation-delay: 0.1s"
      >
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          :class="
            activeTab === tab.value
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-white/40'
          "
        >
          <component :is="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
          <span
            class="ml-1 px-2 py-0.5 rounded-full text-xs"
            :class="activeTab === tab.value ? 'bg-white/20' : 'bg-gray-200'"
          >
            {{ getCount(tab.value) }}
          </span>
        </button>
      </div>

      <!-- Created Courses -->
      <div
        v-if="activeTab === 'created'"
        class="space-y-4 animate-fadeInUp"
        style="animation-delay: 0.2s"
      >
        <div v-if="createdCourses.length > 0" class="space-y-3">
          <CreatedCourseCard
            v-for="course in createdCourses"
            :key="course.id"
            :course="course"
            @click="goToCourse(course.id)"
            @edit="editCourse(course.id)"
          />
        </div>
        <EmptyState v-else type="created" />
      </div>

      <!-- Purchased Courses -->
      <div
        v-if="activeTab === 'purchased'"
        class="space-y-4 animate-fadeInUp"
        style="animation-delay: 0.2s"
      >
        <!-- Фильтры -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            @click="purchasedFilter = 'all'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="
              purchasedFilter === 'all'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:bg-white/40'
            "
          >
            Все
          </button>
          <button
            @click="purchasedFilter = 'in-progress'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="
              purchasedFilter === 'in-progress'
                ? 'bg-accent-cyan/10 text-accent-cyan'
                : 'text-gray-500 hover:bg-white/40'
            "
          >
            В процессе
          </button>
          <button
            @click="purchasedFilter = 'completed'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="
              purchasedFilter === 'completed'
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'text-gray-500 hover:bg-white/40'
            "
          >
            Завершённые
          </button>
          <button
            @click="purchasedFilter = 'not-started'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="
              purchasedFilter === 'not-started'
                ? 'bg-gray-500/10 text-gray-600'
                : 'text-gray-500 hover:bg-white/40'
            "
          >
            Не начатые
          </button>
        </div>

        <div v-if="filteredPurchasedCourses.length > 0" class="space-y-3">
          <PurchasedCourseCard
            v-for="course in filteredPurchasedCourses"
            :key="course.id"
            :course="course"
            :progress="getCourseProgress(course.id)"
            @click="goToCourse(course.id)"
          />
        </div>
        <EmptyState v-else type="purchased" :filter="purchasedFilter" />
      </div>

      <!-- Active Courses (в процессе) -->
      <div
        v-if="activeTab === 'active'"
        class="space-y-4 animate-fadeInUp"
        style="animation-delay: 0.2s"
      >
        <!-- Подсказка -->
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Info class="h-4 w-4" />
          <span>Курсы, которые вы начали, но ещё не завершили</span>
        </div>

        <div v-if="activeCoursesInProgress.length > 0" class="space-y-3">
          <ActiveCourseCard
            v-for="courseData in activeCoursesInProgress"
            :key="courseData.course.id"
            :course="courseData.course"
            :progress="courseData.progress"
            @click="goToCourse(courseData.course.id)"
          />
        </div>
        <EmptyState v-else type="active" />
      </div>

      <!-- Organization Courses -->
      <div
        v-if="activeTab === 'organization'"
        class="space-y-4 animate-fadeInUp"
        style="animation-delay: 0.2s"
      >
        <!-- Выбор организации -->
        <div v-if="userOrganizations.length > 0" class="space-y-4">
          <!-- Селект организации -->
          <div class="glass rounded-xl p-4">
            <label class="text-sm font-medium text-gray-600 mb-2 block">
              Выберите организацию
            </label>
            <div class="relative">
              <select
                v-model="selectedOrgId"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
              >
                <option :value="null">Выберите организацию...</option>
                <option v-for="org in userOrganizations" :key="org.id" :value="org.id">
                  {{ org.name }}
                  <span v-if="org.userId === user?.id" class="text-primary"
                    >(Владелец)</span
                  >
                  <span v-else class="text-gray-400">(Участник)</span>
                </option>
              </select>
              <ChevronDown
                class="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <!-- Курсы выбранной организации -->
          <div v-if="selectedOrgId">
            <div v-if="organizationCourses.length > 0" class="space-y-3">
              <!-- Информация об организации -->
              <div class="flex items-center gap-3 p-4 glass-strong rounded-xl">
                <Building2 class="h-5 w-5 text-accent" />
                <div>
                  <p class="font-medium text-gray-800">{{ selectedOrg?.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ organizationCourses.length }}
                    {{ pluralize(organizationCourses.length, "курс", "курса", "курсов") }}
                  </p>
                </div>
                <router-link
                  v-if="selectedOrg?.userId === user?.id"
                  :to="{ name: 'create-course', query: { orgId: selectedOrgId } }"
                  class="ml-auto btn-primary px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                >
                  <Plus class="h-3 w-3" />
                  Создать
                </router-link>
              </div>

              <!-- Список курсов -->
              <OrganizationCourseCard
                v-for="course in organizationCourses"
                :key="course.id"
                :course="course"
                :progress="getCourseProgress(course.id)"
                :is-owner="selectedOrg?.userId === user?.id"
                @click="goToCourse(course.id)"
              />
            </div>

            <!-- Нет курсов -->
            <div v-else class="glass-strong rounded-2xl p-8 text-center">
              <BookOpen class="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 mb-4">В этой организации пока нет курсов</p>
              <router-link
                v-if="selectedOrg?.userId === user?.id"
                :to="{ name: 'create-course', query: { orgId: selectedOrgId } }"
                class="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium inline-flex items-center gap-2"
              >
                <Plus class="h-4 w-4" />
                Создать первый курс
              </router-link>
            </div>
          </div>

          <!-- Организация не выбрана -->
          <div v-else class="glass-strong rounded-2xl p-8 text-center">
            <Building2 class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">Выберите организацию, чтобы увидеть её курсы</p>
          </div>
        </div>

        <!-- Нет организаций -->
        <div v-else class="glass-strong rounded-2xl p-8 text-center">
          <Building2 class="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500 mb-4">Вы не состоите ни в одной организации</p>
          <router-link
            :to="{ name: 'organizations' }"
            class="text-primary hover:underline text-sm"
          >
            Перейти к организациям →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Plus,
  Award,
  ShoppingBag,
  PlayCircle,
  Info,
  Building2,
  BookOpen,
  ChevronDown,
} from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";
import { useUserCourseProgressStore } from "@/stores/userCourseProgress";
import { useOrganizationStore } from "@/stores/organization";
import CreatedCourseCard from "@/components/course/CreatedCourseCard.vue";
import PurchasedCourseCard from "@/components/course/PurchasedCourseCard.vue";
import ActiveCourseCard from "@/components/course/ActiveCourseCard.vue";
import OrganizationCourseCard from "@/components/course/OrganizationCourseCard.vue";
import EmptyState from "@/components/course/EmptyState.vue";
import type { Course } from "@/types/course";
import type { UserCourseProgress } from "@/types/userCourseProgress";
import type { Organization } from "@/types/Organization";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const progressStore = useUserCourseProgressStore();
const organizationStore = useOrganizationStore();

const activeTab = ref<"created" | "purchased" | "active" | "organization">(
  (route.query.tab as any) || "created"
);
const purchasedFilter = ref<"all" | "in-progress" | "completed" | "not-started">("all");
const selectedOrgId = ref<number | null>(null);

const tabs = [
  { value: "created" as const, label: "Созданные", icon: Award },
  { value: "purchased" as const, label: "Купленные", icon: ShoppingBag },
  { value: "active" as const, label: "В процессе", icon: PlayCircle },
  { value: "organization" as const, label: "Организаций", icon: Building2 },
];

const user = computed(() => authStore.currentUser);
const createdCourses = computed(() => user.value?.courses || []);
const purchasedCourses = computed(() => user.value?.purchasedCourses || []);

// Организации пользователя (где он участник или владелец)
const userOrganizations = computed(() => {
  return organizationStore.allOrgs.filter(
    (org) =>
      org.organizationMembers?.some((m) => m.userId === user.value?.id) ||
      org.userId === user.value?.id
  );
});

// Выбранная организация
const selectedOrg = computed(() => {
  if (!selectedOrgId.value) return null;
  return organizationStore.allOrgs.find((org) => org.id === selectedOrgId.value);
});

// Курсы выбранной организации
const organizationCourses = computed(() => {
  if (!selectedOrg.value) return [];
  return selectedOrg.value.courses || [];
});

const getCourseProgress = (courseId: number): UserCourseProgress | undefined => {
  return progressStore.getCourseProgress(courseId);
};

// Статус прогресса курса
const getProgressStatus = (
  course: Course
): "not-started" | "in-progress" | "completed" => {
  const progress = getCourseProgress(course.id);

  if (!progress) return "not-started";
  if (progress.completedAt) return "completed";
  if (progress.progress >= 100) return "completed";
  if (progress.progress > 0 && progress.progress < 100) return "in-progress";
  return "not-started";
};

// Фильтрованные купленные курсы
const filteredPurchasedCourses = computed(() => {
  const courses = purchasedCourses.value;

  switch (purchasedFilter.value) {
    case "in-progress":
      return courses.filter((c) => getProgressStatus(c) === "in-progress");
    case "completed":
      return courses.filter((c) => getProgressStatus(c) === "completed");
    case "not-started":
      return courses.filter((c) => getProgressStatus(c) === "not-started");
    default:
      return courses;
  }
});

// ТОЛЬКО курсы в процессе (для вкладки "В процессе")
const activeCoursesInProgress = computed(() => {
  return purchasedCourses.value
    .filter((course) => getProgressStatus(course) === "in-progress")
    .map((course) => ({
      course,
      progress: getCourseProgress(course.id) || null,
    }))
    .sort((a, b) => {
      const aProgress = a.progress?.progress || 0;
      const bProgress = b.progress?.progress || 0;
      if (aProgress !== bProgress) return bProgress - aProgress;
      const aDate = a.progress?.lastActivityAt || a.course.createdAt;
      const bDate = b.progress?.lastActivityAt || b.course.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
});

const activeCoursesCount = computed(() => {
  return purchasedCourses.value.filter((c) => getProgressStatus(c) === "in-progress")
    .length;
});

const getCount = (tab: string) => {
  if (tab === "created") return createdCourses.value.length;
  if (tab === "purchased") return purchasedCourses.value.length;
  if (tab === "active") return activeCoursesCount.value;
  if (tab === "organization") return userOrganizations.value.length;
  return 0;
};

const pluralize = (count: number, one: string, two: string, five: string): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two;
  return five;
};

const goToCourse = (courseId: number) => {
  router.push({ name: "single-course-page", params: { id: courseId } });
};

const editCourse = (courseId: number) => {
  router.push({ name: "edit-course", params: { id: courseId } });
};

// Следим за изменением вкладки в URL
watch(
  () => route.query.tab,
  (newTab) => {
    if (
      newTab &&
      ["created", "purchased", "active", "organization"].includes(newTab as string)
    ) {
      activeTab.value = newTab as any;
    }
  }
);

// Обновляем URL при смене вкладки
watch(activeTab, (newTab) => {
  router.replace({ query: { tab: newTab } });
});

onMounted(async () => {
  await Promise.all([progressStore.fetchMyProgress(), organizationStore.getAll()]);
});
</script>
