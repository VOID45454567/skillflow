<template>
  <Modal :model-value="modelValue" width="1/2" @close="emit('close')">
    <div class="space-y-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center"
        >
          <Layers class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800">
            {{ isEditing ? "Редактирование урока" : "Новый урок" }}
          </h3>
          <p class="text-sm text-gray-500">Добавьте контент к вашему уроку</p>
        </div>
      </div>

      <!-- Lesson Basic Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInput
          :model-value="localLesson.title || ''"
          @update:model-value="localLesson.title = $event"
          label="Название урока"
          placeholder="Введение в тему"
        />
        <BaseInput
          :model-value="String(localLesson.requredTimeInMinutes || 15)"
          @update:model-value="localLesson.requredTimeInMinutes = Number($event)"
          type="number"
          label="Время на прохождение (мин)"
          placeholder="15"
        />
      </div>

      <!-- Goals -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Target class="w-4 h-4 text-accent-pink" />
          Цели урока
        </label>
        <div class="flex gap-2">
          <input
            v-model="goalInput"
            type="text"
            placeholder="Что студент узнает..."
            class="input-styled flex-1 px-4 py-2 rounded-xl bg-white/60 border border-gray-200/60 text-sm"
            @keydown.enter.prevent="addGoal"
          />
          <BaseButton @click="addGoal" size="sm">Добавить</BaseButton>
        </div>

        <div v-if="localLesson.goals?.length" class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="(goal, i) in localLesson.goals"
            :key="i"
            class="inline-flex items-center gap-1 px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full"
          >
            {{ goal }}
            <button
              @click="localLesson.goals.splice(i, 1)"
              class="hover:text-accent-cyan"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        </div>
      </div>

      <!-- Content Type Selector -->
      <ContentTypeSelector v-model="activeContentType" :has-content="contentTypeStatus" />

      <!-- Content Builder -->
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <TextBlockBuilder v-if="activeContentType === 'text'" @add="addContentBlock" />
        <MediaBlockBuilder
          v-else-if="activeContentType === 'media'"
          @add="addContentBlock"
        />
        <CodeBlockBuilder
          v-else-if="activeContentType === 'code'"
          @add="addContentBlock"
        />
      </div>

      <!-- Content Blocks List -->
      <ContentBlocksList :blocks="contentBlocks" @remove="removeBlock" />

      <div class="flex gap-3 pt-4">
        <BaseButton @click="saveLesson" class="flex-1">
          {{ isEditing ? "Сохранить урок" : "Добавить урок" }}
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { Layers, Target, X } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";
import ContentTypeSelector from "./ContentTypeSelector.vue";
import TextBlockBuilder from "./TextBlockBuilder.vue";
import MediaBlockBuilder from "./MediaBlockBuilder.vue";
import CodeBlockBuilder from "./CodeBlockBuilder.vue";
import ContentBlocksList from "./ContentBlocksList.vue";
import type { ContentSection, Lesson, LessonContent } from "@/types/course/Lesson";

type ContentType = "text" | "media" | "code";

interface LessonWithContent extends Partial<Omit<Lesson, "content">> {
  content: LessonContent;
}

const props = defineProps<{
  modelValue: boolean;
  lesson: LessonWithContent;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [lesson: LessonWithContent];
  close: [];
}>();

const localLesson = reactive<LessonWithContent>({
  title: "",
  requredTimeInMinutes: 15,
  goals: [],
  content: { sections: [] },
});

const goalInput = ref("");
const activeContentType = ref<ContentType>("text");
const contentBlocks = ref<ContentSection[]>([]);

const contentTypeStatus = computed(() => ({
  text: contentBlocks.value.some((b) => b.type === "text"),
  media: contentBlocks.value.some((b) => b.type === "media"),
  code: contentBlocks.value.some((b) => b.type === "code"),
}));

const addGoal = () => {
  const trimmed = goalInput.value.trim();
  if (trimmed && !localLesson.goals?.includes(trimmed)) {
    localLesson.goals = [...(localLesson.goals || []), trimmed];
    goalInput.value = "";
  }
};

const addContentBlock = (block: ContentSection) => {
  contentBlocks.value.push({
    ...block,
    id: `${block.type}-${Date.now()}`,
  });
};

const removeBlock = (index: number) => {
  contentBlocks.value.splice(index, 1);
};

const saveLesson = () => {
  const lessonData: LessonWithContent = {
    ...localLesson,
    content: { sections: [...contentBlocks.value] },
  };
  emit("save", lessonData);
  emit("close");
};

watch(
  () => props.lesson,
  (newLesson) => {
    if (newLesson) {
      localLesson.title = newLesson.title || "";
      localLesson.requredTimeInMinutes = newLesson.requredTimeInMinutes || 15;
      localLesson.goals = [...(newLesson.goals || [])];
      contentBlocks.value = [...(newLesson.content?.sections || [])];
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      activeContentType.value = "text";
    }
  }
);
</script>
