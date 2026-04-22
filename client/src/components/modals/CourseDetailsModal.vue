<!-- components/admin/CourseDetailsModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="$emit('close')" width="lg">
    <div v-if="course" class="space-y-5">
      <!-- Заголовок -->
      <div class="flex items-start gap-4">
        <div
          class="h-16 w-16 rounded-xl flex items-center justify-center shrink-0"
          :style="{
            background: `linear-gradient(135deg, ${courseColor.from}, ${courseColor.to})`,
          }"
        >
          <BookOpen class="h-8 w-8 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-gray-800 truncate">{{ course.title }}</h3>
          <p class="text-sm text-gray-500 mt-1 line-clamp-2">
            {{ course.description || "Описание отсутствует" }}
          </p>
        </div>
      </div>

      <!-- Основная информация -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 glass rounded-xl">
          <p class="text-xs text-gray-500 mb-1">ID курса</p>
          <p class="text-lg font-semibold text-gray-800">#{{ course.id }}</p>
        </div>
        <div class="p-4 glass rounded-xl">
          <p class="text-xs text-gray-500 mb-1">Уровень</p>
          <p class="text-lg font-semibold text-gray-800">
            {{ mapCourseLevel(course.level) }}
          </p>
        </div>
        <div class="p-4 glass rounded-xl">
          <p class="text-xs text-gray-500 mb-1">Тип</p>
          <p class="text-lg font-semibold text-gray-800">
            {{ course.isFree ? "Бесплатный" : "Платный" }}
          </p>
        </div>
        <div class="p-4 glass rounded-xl">
          <p class="text-xs text-gray-500 mb-1">Цена</p>
          <p class="text-lg font-semibold text-gray-800">
            {{ course.isFree ? "—" : formatPrice(course.price) }}
          </p>
        </div>
        <div class="p-4 glass rounded-xl">
          <p class="text-xs text-gray-500 mb-1">Видимость</p>
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="getVisibilityClass(course.visibility)"
          >
            {{ getVisibilityLabel(course.visibility) }}
          </span>
        </div>
        <div class="p-4 glass rounded-xl">
          <p class="text-xs text-gray-500 mb-1">Уроков</p>
          <p class="text-lg font-semibold text-gray-800">
            {{ course.lessons?.length || 0 }}
          </p>
        </div>
      </div>

      <!-- Создатель -->
      <div class="p-4 glass rounded-xl">
        <p class="text-xs text-gray-500 mb-2">Создатель</p>
        <button
          @click="openUserModal"
          class="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            :src="course.user?.avatarUrl || '/placeholder-avatar.png'"
            class="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p class="font-medium text-primary hover:underline">
              {{ course.user?.login || "Неизвестный автор" }}
            </p>
            <p class="text-xs text-gray-500">{{ course.user?.email }}</p>
          </div>
        </button>
      </div>

      <!-- Организация (если есть) -->
      <div v-if="course.organization" class="p-4 glass rounded-xl">
        <p class="text-xs text-gray-500 mb-2">Организация</p>
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Building2 class="h-5 w-5 text-accent" />
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ course.organization.name }}</p>
            <p class="text-xs text-gray-500">{{ course.organization.description }}</p>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="p-4 glass rounded-xl">
        <p class="text-xs text-gray-500 mb-3">Статистика</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">
              {{ course.userCourseProgresses?.length || 0 }}
            </p>
            <p class="text-xs text-gray-500">Студентов</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-800">
              {{ course.reviews?.length || 0 }}
            </p>
            <p class="text-xs text-gray-500">Отзывов</p>
          </div>
        </div>
      </div>

      <!-- Категории и теги -->
      <div v-if="course.courseTerms?.length" class="p-4 glass rounded-xl">
        <p class="text-xs text-gray-500 mb-2">Категории и теги</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="term in course.courseTerms"
            :key="term.id"
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="
              term.type === 'CATEGORY'
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 text-gray-600'
            "
          >
            {{ term.name }}
          </span>
        </div>
      </div>

      <!-- Даты -->
      <div class="p-4 glass rounded-xl">
        <p class="text-xs text-gray-500 mb-2">Даты</p>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Создан:</span>
            <span class="text-sm text-gray-800">{{ formatDate(course.createdAt) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Обновлен:</span>
            <span class="text-sm text-gray-800">{{ formatDate(course.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex gap-3 pt-3 border-t border-gray-200/40">
        <BaseButton variant="outlined" class="flex-1" @click="goToCourse">
          <Eye class="h-4 w-4 mr-2" />
          Просмотреть курс
        </BaseButton>
        <BaseButton variant="outlined" class="flex-1" @click="$emit('close')">
          Закрыть
        </BaseButton>
      </div>
    </div>
  </Modal>

  <!-- Модалка пользователя -->
  <UserDetailsModal v-model="selectedUser" @close="selectedUser = null" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { BookOpen, Building2, Eye } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import UserDetailsModal from "./UserDetailsModal.vue";
import { CourseLevels } from "@/types/enums/course-levels";
import { CourseVisibilityTypes } from "@/types/enums/course-visibility-types";
import type { Course } from "@/types/course";
import type { User } from "@/types/user";

const props = defineProps<{
  modelValue: Course | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: Course | null];
  close: [];
}>();

const router = useRouter();

const course = ref<Course | null>(null);
const selectedUser = ref<User | null>(null);

// Следим за изменением modelValue
import { watch } from "vue";
watch(
  () => props.modelValue,
  (val) => {
    course.value = val;
  }
);

const courseColor = computed(() => {
  const level = course.value?.level?.toString().toUpperCase() || "";
  const colors: Record<string, { from: string; to: string }> = {
    BEGINNER: { from: "#67e8f9", to: "#6366f1" },
    INTERMEDIATE: { from: "#6366f1", to: "#a78bfa" },
    ADVANCED: { from: "#a78bfa", to: "#f472b6" },
    PROFESSIONAL: { from: "#f472b6", to: "#ef4444" },
  };
  return colors[level] || { from: "#6366f1", to: "#a78bfa" };
});

const mapCourseLevel = (level: CourseLevels): string => {
  const levels: Record<CourseLevels, string> = {
    [CourseLevels.BEGINNER]: "Начинающий",
    [CourseLevels.INTERMEDIATE]: "Средний",
    [CourseLevels.ADVANCED]: "Продвинутый",
    [CourseLevels.PROFESSIONAL]: "Профессиональный",
  };
  return levels[level] || level;
};

const getVisibilityClass = (visibility: CourseVisibilityTypes): string => {
  const classes: Record<CourseVisibilityTypes, string> = {
    ORGANIZATION: "bg-accent/10 text-accent",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    DRAFT: "bg-gray-100 text-gray-600",
  };
  return classes[visibility] || "bg-gray-100 text-gray-600";
};

const getVisibilityLabel = (visibility: CourseVisibilityTypes): string => {
  const labels: Record<CourseVisibilityTypes, string> = {
    ORGANIZATION: "Организация",
    PUBLISHED: "Опубликован",
    DRAFT: "Черновик",
  };
  return labels[visibility] || visibility;
};

const formatPrice = (price?: number): string => {
  if (!price) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const openUserModal = () => {
  if (course.value?.user) {
    selectedUser.value = course.value.user;
  }
};

const goToCourse = () => {
  if (course.value) {
    router.push({ name: "single-course-page", params: { id: course.value.id } });
    emit("close");
  }
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
