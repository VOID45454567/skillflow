<!-- views/CreateCoursePage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Header -->
      <div class="animate-fadeInUp">
        <div class="flex items-center gap-3 mb-2">
          <button
            @click="goBack"
            class="p-2 rounded-lg glass hover:bg-surface-hover transition-all"
          >
            <ArrowLeft class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">
              {{ isForOrganization ? "Создание курса организации" : "Создание курса" }}
            </h1>
            <p class="text-gray-500">
              {{
                isForOrganization
                  ? `Курс будет создан в организации "${organizationName}"`
                  : "Создайте свой уникальный курс и делитесь знаниями"
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <CourseProgressBar :percentage="completionPercentage" />

      <!-- Course Basic Info -->
      <CourseBasicInfo
        v-model:title="courseData.title"
        v-model:description="courseData.description"
        v-model:level="courseData.level"
        v-model:isFree="courseData.isFree"
        v-model:price="courseData.price"
        v-model:selectedCategory="selectedCategory"
        v-model:selectedTags="selectedTags"
        @open-terms-modal="showTermsModal = true"
      />

      <!-- Lessons Section -->
      <CourseLessonsList
        :lessons="lessons"
        :total-duration="totalDuration"
        :selected-lesson-index="selectedLessonIndex"
        @add="openLessonModal"
        @edit="editLesson"
        @remove="removeLesson"
        @select="selectLesson"
      />

      <!-- Content Preview -->
      <div
        v-if="selectedLesson"
        class="glass-strong rounded-3xl p-6 lg:p-8 animate-fadeInUp"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-linear-to-br from-accent-cyan to-primary flex items-center justify-center"
            >
              <Eye class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                Предпросмотр: {{ selectedLesson.title }}
              </h2>
              <p class="text-sm text-gray-500">Так будет выглядеть урок для студентов</p>
            </div>
          </div>

          <!-- Переключатель уроков -->
          <div v-if="lessons.length > 1" class="flex items-center gap-2">
            <button
              @click="prevLesson"
              :disabled="selectedLessonIndex === 0"
              class="p-2 rounded-lg glass hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <span class="text-sm text-gray-500">
              {{ selectedLessonIndex + 1 }} / {{ lessons.length }}
            </span>
            <button
              @click="nextLesson"
              :disabled="selectedLessonIndex === lessons.length - 1"
              class="p-2 rounded-lg glass hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <ContentBlockPreview :content="selectedLesson.content" />
      </div>

      <!-- No lessons message -->
      <div
        v-else-if="lessons.length === 0"
        class="glass-strong rounded-3xl p-8 text-center animate-fadeInUp"
      >
        <Eye class="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p class="text-gray-500">Добавьте урок, чтобы увидеть предпросмотр</p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-end pt-4 animate-fadeInUp">
        <BaseButton variant="outlined" @click="saveDraft">
          <Save class="w-4 h-4 mr-2" />
          Сохранить черновик
        </BaseButton>
        <BaseButton @click="publishCourse">
          <Rocket class="w-4 h-4 mr-2" />
          {{ isForOrganization ? "Опубликовать в организации" : "Опубликовать курс" }}
        </BaseButton>
      </div>
    </div>

    <!-- Lesson Modal -->
    <LessonModal
      v-model="showLessonModal"
      :lesson="currentLesson"
      :is-editing="editingLessonIndex !== null"
      @save="saveLesson"
      @close="closeLessonModal"
    />

    <!-- Terms Modal -->
    <Modal v-model="showTermsModal" width="lg" @close="showTermsModal = false">
      <CategoryTagsSelector
        v-model:selected-category="selectedCategory"
        v-model:selected-tags="selectedTags"
        @close="showTermsModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Eye, Save, Rocket, ChevronLeft, ChevronRight, ArrowLeft } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import Modal from "@/components/common/Modal.vue";
import CourseProgressBar from "@/components/course/create/CourseProgressBar.vue";
import CourseBasicInfo from "@/components/course/create/CourseBasicInfo.vue";
import CourseLessonsList from "@/components/course/create/CourseLessonsList.vue";
import LessonModal from "@/components/course/create/LessonModal.vue";
import CategoryTagsSelector from "@/components/course/create/CategoryTagsSelector.vue";
import ContentBlockPreview from "@/components/course/ContentBlockPreview.vue";
import { useToast } from "@/composables/useToast";
import { useTermStore } from "@/stores/terms";
import { useCoursesStore } from "@/stores/courses";
import { useCourseDraftStore } from "@/stores/courses/courseDraft";
import { useOrganizationStore } from "@/stores/organization";
import type { CourseTerm } from "@/types/course/course-term";
import type { Lesson, LessonContent } from "@/types/course/Lesson";

interface LessonWithTemp extends Partial<Omit<Lesson, "content">> {
  tempId?: number;
  content: LessonContent;
}

const { success, error: showError } = useToast();
const termStore = useTermStore();
const draftStore = useCourseDraftStore();
const coursesStore = useCoursesStore();
const organizationStore = useOrganizationStore();
const router = useRouter();
const route = useRoute();

const orgId = ref<number | undefined>();
const isForOrganization = computed(() => !!orgId.value);
const organizationName = computed(() => {
  if (!orgId.value) return "";
  const org = organizationStore.allOrgs.find((o) => o.id === orgId.value);
  return org?.name || "";
});

// Course Data
const courseData = ref({
  title: "",
  description: "",
  level: "",
  isFree: true,
  price: 0,
});

const selectedCategory = ref<CourseTerm | null>(null);
const selectedTags = ref<CourseTerm[]>([]);

// Lessons
const lessons = ref<LessonWithTemp[]>([]);
const showLessonModal = ref(false);
const showTermsModal = ref(false);
const editingLessonIndex = ref<number | null>(null);
const selectedLessonIndex = ref(0);

const currentLesson = ref<LessonWithTemp>({
  title: "",
  requredTime: 15,
  goals: [],
  content: { sections: [] },
});

// Computed
const completionPercentage = computed(() => {
  let filled = 0;
  const total = 5;
  if (courseData.value.title) filled++;
  if (courseData.value.description) filled++;
  if (courseData.value.level) filled++;
  if (selectedCategory.value) filled++;
  if (lessons.value.length > 0) filled++;
  return Math.round((filled / total) * 100);
});

const totalDuration = computed(() => {
  return lessons.value.reduce((acc, l) => acc + (l.requredTime || 0), 0);
});

const selectedLesson = computed(() => {
  if (lessons.value.length === 0) return null;
  return lessons.value[selectedLessonIndex.value];
});

// Methods
const selectLesson = (index: number) => {
  selectedLessonIndex.value = index;
};

const prevLesson = () => {
  if (selectedLessonIndex.value > 0) {
    selectedLessonIndex.value--;
  }
};

const nextLesson = () => {
  if (selectedLessonIndex.value < lessons.value.length - 1) {
    selectedLessonIndex.value++;
  }
};

const openLessonModal = () => {
  editingLessonIndex.value = null;
  currentLesson.value = {
    title: "",
    requredTime: 15,
    goals: [],
    content: { sections: [] },
  };
  showLessonModal.value = true;
};

const editLesson = (index: number) => {
  editingLessonIndex.value = index;
  currentLesson.value = {
    ...lessons.value[index],
    content: { ...lessons.value[index]!.content },
  };
  showLessonModal.value = true;
};

const removeLesson = (index: number) => {
  lessons.value.splice(index, 1);
  if (selectedLessonIndex.value >= lessons.value.length) {
    selectedLessonIndex.value = Math.max(0, lessons.value.length - 1);
  }
};

const saveLesson = (lesson: LessonWithTemp) => {
  const lessonData: LessonWithTemp = {
    ...lesson,
    content: { sections: [...lesson.content.sections] },
    tempId:
      editingLessonIndex.value !== null
        ? lessons.value[editingLessonIndex.value]?.tempId
        : Date.now(),
  };

  if (editingLessonIndex.value !== null) {
    lessons.value[editingLessonIndex.value] = lessonData;
  } else {
    lessons.value.push(lessonData);
    selectedLessonIndex.value = lessons.value.length - 1;
  }

  showLessonModal.value = false;
};

const closeLessonModal = () => {
  showLessonModal.value = false;
  editingLessonIndex.value = null;
};

const autoSaveDraft = () => {
  const draft = {
    title: courseData.value.title,
    description: courseData.value.description,
    level: courseData.value.level,
    isFree: courseData.value.isFree,
    price: courseData.value.price,
    category: selectedCategory.value,
    tags: selectedTags.value,
    lessons: lessons.value.map(({ tempId, ...lesson }) => lesson as any),
    orgId: orgId.value,
  };
  draftStore.saveDraft(draft);
};

const saveDraft = () => {
  autoSaveDraft();
  success("Черновик сохранён");
};

const publishCourse = async () => {
  const validation = coursesStore.validateCourse(
    courseData.value,
    selectedCategory.value,
    lessons.value
  );

  if (!validation.valid) {
    showError(validation.error!);
    return;
  }

  try {
    const visibility = isForOrganization.value ? "ORGANIZATION" : "DRAFT";

    const result = await coursesStore.createCourse(
      courseData.value,
      selectedCategory.value,
      selectedTags.value,
      lessons.value,
      visibility,
      orgId.value // Передаем orgId если курс для организации
    );

    success(
      isForOrganization.value
        ? "Курс успешно опубликован в организации!"
        : "Курс успешно опубликован!"
    );

    draftStore.clearDraft();

    // Возвращаемся назад
    goBack();
  } catch (err: any) {
    showError(err?.message || "Не удалось опубликовать курс");
  }
};

const goBack = () => {
  if (isForOrganization.value) {
    router.push({ name: "organization-dashboard", params: { id: orgId.value } });
  } else {
    router.push({ name: "profile" });
  }
};

watch(
  [courseData, selectedCategory, selectedTags, lessons],
  () => {
    if (courseData.value.title || lessons.value.length > 0) {
      autoSaveDraft();
    }
  },
  { deep: true }
);

onMounted(async () => {
  // Получаем orgId из query параметров
  orgId.value = route.query.orgId ? Number(route.query.orgId) : undefined;

  await Promise.all([termStore.getCategories(), termStore.getTags()]);

  // Загружаем организации если нужно
  if (orgId.value && !organizationStore.allOrgs.length) {
    await organizationStore.getAll();
  }

  const draft = draftStore.loadDraft();
  if (draft) {
    courseData.value = {
      title: draft.title || "",
      description: draft.description || "",
      level: draft.level || "",
      isFree: draft.isFree ?? true,
      price: draft.price || 0,
    };
    selectedCategory.value = draft.category;
    selectedTags.value = draft.tags || [];
    lessons.value = (draft.lessons || []).map((l: any, index: number) => ({
      ...l,
      tempId: Date.now() + index,
      content: l.content || { sections: [] },
    }));

    if (lessons.value.length > 0) {
      selectedLessonIndex.value = 0;
    }

    // Восстанавливаем orgId из черновика если есть
    if (draft.orgId && !orgId.value) {
      orgId.value = draft.orgId;
    }
  }
});
</script>
