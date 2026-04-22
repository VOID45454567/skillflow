<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="animate-fadeInUp">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Каталог курсов</h1>
        <p class="text-gray-500">Найдите идеальный курс для вашего обучения</p>
      </div>

      <!-- Search and Filters -->
      <div class="space-y-4 animate-fadeInUp" style="animation-delay: 0.1s">
        <!-- Search Bar -->
        <div class="glass-strong rounded-2xl p-1 flex items-center">
          <Search class="h-5 w-5 text-gray-400 ml-4 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск курсов..."
            class="flex-1 min-w-0 px-4 py-3 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
          <BaseButton
            v-if="searchQuery"
            variant="ghost"
            size="sm"
            @click="searchQuery = ''"
            class="shrink-0 mr-2"
          >
            <X class="h-4 w-4" />
          </BaseButton>
        </div>

        <!-- Filters Row -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <!-- Tags Filter -->
          <div class="relative">
            <button
              @click.stop="toggleFilter('tags')"
              class="glass px-3 sm:px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-surface-hover transition-all"
              :class="{ 'border-primary bg-primary/10': activeFilter === 'tags' }"
            >
              <Hash class="h-4 w-4" />
              <span class="hidden sm:inline">Теги</span>
              <ChevronDown
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': activeFilter === 'tags' }"
              />
            </button>

            <div
              v-if="activeFilter === 'tags'"
              class="absolute top-full left-0 mt-2 w-56 sm:w-64 glass-strong rounded-xl p-2 shadow-lg z-20 max-h-64 overflow-y-auto animate-scaleIn"
              @click.stop
            >
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="toggleTag(tag)"
                class="w-full px-4 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between"
                :class="
                  selectedTags.includes(tag)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-white/40'
                "
              >
                {{ tag }}
                <CheckCircle v-if="selectedTags.includes(tag)" class="h-4 w-4" />
              </button>
              <p
                v-if="availableTags.length === 0"
                class="text-sm text-gray-500 text-center py-2"
              >
                Нет доступных тегов
              </p>
            </div>
          </div>

          <!-- Price Filter -->
          <div class="relative">
            <button
              @click.stop="toggleFilter('price')"
              class="glass px-3 sm:px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-surface-hover transition-all"
              :class="{ 'border-primary bg-primary/10': activeFilter === 'price' }"
            >
              <Wallet class="h-4 w-4" />
              <span class="hidden sm:inline">Цена</span>
              <ChevronDown
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': activeFilter === 'price' }"
              />
            </button>

            <div
              v-if="activeFilter === 'price'"
              class="absolute top-full left-0 mt-2 w-64 glass-strong rounded-xl p-4 shadow-lg z-20 animate-scaleIn"
              @click.stop
            >
              <div class="space-y-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="showFreeOnly"
                    class="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span class="text-sm">Только бесплатные</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Sort Dropdown -->
          <div class="relative ml-auto">
            <button
              @click.stop="toggleFilter('sort')"
              class="glass px-3 sm:px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-surface-hover transition-all"
              :class="{ 'border-primary bg-primary/10': activeFilter === 'sort' }"
            >
              <ArrowUpDown class="h-4 w-4" />
              <span class="hidden sm:inline">{{ getSortLabel() }}</span>
              <ChevronDown
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': activeFilter === 'sort' }"
              />
            </button>

            <div
              v-if="activeFilter === 'sort'"
              class="absolute top-full right-0 mt-2 w-56 glass-strong rounded-xl p-2 shadow-lg z-20 animate-scaleIn"
              @click.stop
            >
              <button
                v-for="option in sortOptions"
                :key="option.value"
                @click="selectSort(option.value)"
                class="w-full px-4 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between"
                :class="
                  sortBy === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-white/40'
                "
              >
                {{ option.label }}
                <CheckCircle v-if="sortBy === option.value" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filters Tags -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
          <span
            v-for="tag in selectedTags"
            :key="tag"
            class="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full"
          >
            {{ tag }}
            <button @click="toggleTag(tag)">
              <X class="h-3 w-3" />
            </button>
          </span>

          <span
            v-if="showFreeOnly"
            class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs rounded-full"
          >
            Бесплатные
            <button @click="showFreeOnly = false">
              <X class="h-3 w-3" />
            </button>
          </span>

          <button
            @click="clearAllFilters"
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Очистить все
          </button>
        </div>
      </div>

      <!-- Results count and view toggle -->
      <div
        class="flex items-center justify-between animate-fadeInUp"
        style="animation-delay: 0.2s"
      >
        <p class="text-sm text-gray-500">
          Найдено
          <span class="font-medium text-gray-700">{{ filteredCourses.length }}</span>
          курсов
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded-lg transition-colors"
            :class="
              viewMode === 'grid'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-400 hover:text-gray-600'
            "
          >
            <LayoutGrid class="h-4 w-4" />
          </button>
          <button
            @click="viewMode = 'list'"
            class="p-2 rounded-lg transition-colors"
            :class="
              viewMode === 'list'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-400 hover:text-gray-600'
            "
          >
            <LayoutList class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Courses Grid -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <CourseCard
          v-for="(course, idx) in paginatedCourses"
          :key="course.id"
          :course="course"
          :delay="0.3 + idx * 0.05"
        />
      </div>

      <!-- Courses List -->
      <div v-else class="space-y-4">
        <CourseListItem
          v-for="(course, idx) in paginatedCourses"
          :key="course.id"
          :course="course"
          :delay="0.3 + idx * 0.05"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredCourses.length === 0 && !loading"
        class="text-center py-16 animate-fadeInUp"
      >
        <Search class="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Курсы не найдены</h3>
        <p class="text-gray-500 mb-4">Попробуйте изменить параметры поиска</p>
        <BaseButton @click="clearAllFilters"> Сбросить фильтры </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <Loader2 class="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
        <p class="text-gray-500">Загрузка курсов...</p>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredCourses.length > 0"
        class="flex items-center justify-center gap-1 sm:gap-2 pt-8"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl glass flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-all"
        >
          <ChevronLeft class="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <template v-for="page in totalPages" :key="page">
          <button
            v-if="
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            "
            @click="currentPage = page"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all text-sm"
            :class="
              currentPage === page
                ? 'bg-primary text-white'
                : 'glass hover:bg-surface-hover'
            "
          >
            {{ page }}
          </button>
          <span
            v-else-if="page === currentPage - 2 || page === currentPage + 2"
            class="text-gray-400"
            >...</span
          >
        </template>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl glass flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-all"
        >
          <ChevronRight class="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  Search,
  X,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  CheckCircle,
  Hash,
  ArrowUpDown,
  Loader2,
} from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import CourseCard from "@/components/ui/CourseCard.vue";
import CourseListItem from "@/components/course/CourseListItem.vue";
import { useToast } from "@/composables/useToast";
import { API } from "@/api";
import type { Course } from "@/types/course";
import { useCoursesStore } from "@/stores/courses";
import { CourseVisibilityTypes } from "@/types/enums/course-visibility-types";

const { error: showError } = useToast();
const coursesStore = useCoursesStore();

const courses = computed(
  () =>
    coursesStore.courses?.filter(
      (c) => c.visibility === CourseVisibilityTypes.PUBLISHED
    ) || []
);
const loading = ref(false);
const searchQuery = ref("");
const selectedTags = ref<string[]>([]);
const showFreeOnly = ref(false);
const sortBy = ref<"newest" | "price_asc" | "price_desc">("newest");
const viewMode = ref<"grid" | "list">("grid");
const currentPage = ref(1);
const activeFilter = ref<string | null>(null);
const itemsPerPage = 9;

const sortOptions = [
  { value: "newest", label: "Сначала новые" },
  { value: "price_asc", label: "Цена: по возрастанию" },
  { value: "price_desc", label: "Цена: по убыванию" },
];

// Computed
const availableTags = computed(() => {
  const tags = new Set<string>();
  courses.value.forEach((course) => {
    course.courseTerms?.forEach((term: any) => {
      if (term.type === "TAG") {
        tags.add(term.name);
      }
    });
  });
  return Array.from(tags);
});

const hasActiveFilters = computed(() => {
  return selectedTags.value.length > 0 || showFreeOnly.value;
});

const filteredCourses = computed(() => {
  let filtered = [...courses.value];
  console.log(courses.value);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );
  }

  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((c) =>
      c.courseTerms?.some(
        (term: any) => term.type === "TAG" && selectedTags.value.includes(term.name)
      )
    );
  }

  if (showFreeOnly.value) {
    filtered = filtered.filter((c) => c.isFree);
  }

  // Sorting
  switch (sortBy.value) {
    case "newest":
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "price_asc":
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "price_desc":
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
  }

  return filtered;
});

const totalPages = computed(
  () => Math.ceil(filteredCourses.value.length / itemsPerPage) || 1
);

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCourses.value.slice(start, end);
});

// Methods
const toggleFilter = (filter: string) => {
  activeFilter.value = activeFilter.value === filter ? null : filter;
};

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  activeFilter.value = null;
};

const selectSort = (value: typeof sortBy.value) => {
  sortBy.value = value;
  activeFilter.value = null;
};

const getSortLabel = (): string => {
  return sortOptions.find((o) => o.value === sortBy.value)?.label || "Сортировка";
};

const clearAllFilters = () => {
  selectedTags.value = [];
  showFreeOnly.value = false;
  searchQuery.value = "";
  sortBy.value = "newest";
  activeFilter.value = null;
};

const formatCourseForCard = (course: Course) => {
  const colorGradients: Record<string, { from: string; to: string }> = {
    BEGINNER: { from: "#67e8f9", to: "#6366f1" },
    INTERMEDIATE: { from: "#6366f1", to: "#a78bfa" },
    ADVANCED: { from: "#a78bfa", to: "#f472b6" },
    PROFESSIONAL: { from: "#f472b6", to: "#ef4444" },
  };

  const categoryTag = course.courseTerms?.find((t: any) => t.type === "CATEGORY");
  const category = categoryTag?.name || "Программирование";

  const iconMap: Record<string, string> = {
    Программирование: "code",
    Дизайн: "palette",
    Маркетинг: "trending-up",
    Бизнес: "briefcase",
    Аналитика: "bar-chart",
    Менеджмент: "users",
  };

  const duration =
    course.lessons?.reduce((acc: number, l: any) => acc + (l.requredTime || 0), 0) || 0;

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: category as any,
    level: (course as any).level || "BEGINNER",
    studentsCount: (course as any).studentsCount || 0,
    duration: Math.ceil(duration / 60),
    rating: (course as any).rating || 0,
    icon: iconMap[category] || "book-open",
    colorGradient: colorGradients[(course as any).level || "BEGINNER"] || {
      from: "#6366f1",
      to: "#a78bfa",
    },
    isFree: course.isFree,
    price: course.price || 0,
  };
};

const fetchCourses = async () => {
  await coursesStore.getAll();
};

watch([searchQuery, selectedTags, showFreeOnly, sortBy], () => {
  currentPage.value = 1;
});

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    activeFilter.value = null;
  }
};

onMounted(() => {
  fetchCourses();
  document.addEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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
