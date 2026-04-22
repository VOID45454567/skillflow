<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Layers, Folder, Tag, CheckCircle } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { useTermStore } from "@/stores/terms";
import type { CourseTerm } from "@/types/course/course-term";

const props = defineProps<{
  selectedCategory: CourseTerm | null;
  selectedTags: CourseTerm[];
}>();

const emit = defineEmits<{
  "update:selectedCategory": [value: CourseTerm | null];
  "update:selectedTags": [value: CourseTerm[]];
  close: [];
}>();

const termStore = useTermStore();

const tempCategory = ref<CourseTerm | null>(null);
const tempTags = ref<CourseTerm[]>([]);

// Инициализация при открытии
const initSelections = () => {
  console.log("🔵 Init selections:", {
    category: props.selectedCategory,
    tags: props.selectedTags,
  });
  tempCategory.value = props.selectedCategory ? { ...props.selectedCategory } : null;
  tempTags.value = [...props.selectedTags];
};

// Загружаем данные при монтировании
onMounted(async () => {
  console.log("🟢 CategoryTagsSelector mounted");
  initSelections();

  if (termStore.categories.length === 0) {
    console.log("📦 Loading categories...");
    await termStore.getCategories();
    console.log("✅ Categories loaded:", termStore.categories);
  }
  if (termStore.tags.length === 0) {
    console.log("📦 Loading tags...");
    await termStore.getTags();
    console.log("✅ Tags loaded:", termStore.tags);
  }
});

// Следим за изменением props
watch(
  () => props.selectedCategory,
  (newVal) => {
    console.log("🔄 selectedCategory changed:", newVal);
    if (!newVal) {
      tempCategory.value = null;
    }
  },
  { deep: true }
);

const selectCategory = (category: CourseTerm) => {
  console.log("🟡 Category clicked:", category);
  tempCategory.value = { ...category };
  console.log("✅ Category selected:", tempCategory.value);
};

const toggleTag = (tag: CourseTerm) => {
  console.log("🟡 Tag clicked:", tag);
  const index = tempTags.value.findIndex((t) => t.id === tag.id);
  console.log("Tag index:", index);

  if (index > -1) {
    tempTags.value.splice(index, 1);
    console.log("❌ Tag removed");
  } else {
    tempTags.value.push({ ...tag });
    console.log("✅ Tag added");
  }
  console.log("Current tags:", tempTags.value);
};

const isTagSelected = (tagId: number) => {
  const selected = tempTags.value.some((t) => t.id === tagId);
  return selected;
};

const saveSelection = () => {
  console.log("💾 Saving selection:", {
    category: tempCategory.value,
    tags: tempTags.value,
  });
  emit("update:selectedCategory", tempCategory.value ? { ...tempCategory.value } : null);
  emit("update:selectedTags", [...tempTags.value]);
  emit("close");
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-4">
      <div
        class="w-10 h-10 rounded-xl bg-linear-to-br from-accent to-accent-pink flex items-center justify-center"
      >
        <Layers class="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-800">Категории и теги</h3>
        <p class="text-sm text-gray-500">Выберите категорию и теги для вашего курса</p>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="p-2 bg-gray-100 rounded text-xs">
      <p>
        Debug: Categories: {{ termStore.categories.length }}, Tags:
        {{ termStore.tags.length }}
      </p>
      <p>Selected Category: {{ tempCategory?.name || "none" }}</p>
      <p>Selected Tags: {{ tempTags.map((t) => t.name).join(", ") || "none" }}</p>
    </div>

    <!-- Categories -->
    <div class="space-y-3">
      <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
        <Folder class="w-4 h-4 text-primary" />
        Категория <span class="text-accent-pink">*</span>
      </label>
      <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
        <button
          v-for="category in termStore.categories"
          :key="category.id"
          type="button"
          @click="selectCategory(category)"
          class="px-4 py-3 rounded-xl border transition-all text-left"
          :class="
            tempCategory?.id === category.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white/40'
          "
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{{ category.name }}</span>
            <CheckCircle v-if="tempCategory?.id === category.id" class="w-4 h-4" />
          </div>
        </button>
      </div>
      <p
        v-if="termStore.categories.length === 0"
        class="text-sm text-gray-400 text-center py-4"
      >
        Нет доступных категорий
      </p>
    </div>

    <!-- Tags -->
    <div class="space-y-3">
      <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
        <Tag class="w-4 h-4 text-accent-cyan" />
        Теги
      </label>
      <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        <button
          v-for="tag in termStore.tags"
          :key="tag.id"
          type="button"
          @click="toggleTag(tag)"
          class="px-3 py-2 rounded-lg border transition-all text-sm"
          :class="
            isTagSelected(tag.id)
              ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white/40'
          "
        >
          {{ tag.name }}
          <CheckCircle v-if="isTagSelected(tag.id)" class="w-3 h-3 inline ml-1" />
        </button>
      </div>
      <p
        v-if="termStore.tags.length === 0"
        class="text-sm text-gray-400 text-center py-4"
      >
        Нет доступных тегов
      </p>
    </div>

    <!-- Selected Summary -->
    <div class="p-4 bg-white/40 rounded-xl space-y-2">
      <p class="text-sm font-medium text-gray-700">Выбрано:</p>
      <div class="space-y-1">
        <p class="text-sm text-gray-600">
          <span class="font-medium">Категория:</span>
          <span :class="tempCategory ? 'text-primary' : 'text-gray-400'">
            {{ tempCategory?.name || "не выбрана" }}
          </span>
        </p>
        <p class="text-sm text-gray-600">
          <span class="font-medium">Теги ({{ tempTags.length }}):</span>
          <span :class="tempTags.length > 0 ? 'text-accent-cyan' : 'text-gray-400'">
            {{
              tempTags.length > 0 ? tempTags.map((t) => t.name).join(", ") : "не выбраны"
            }}
          </span>
        </p>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <BaseButton variant="outlined" class="flex-1" @click="emit('close')">
        Отмена
      </BaseButton>
      <BaseButton class="flex-1" @click="saveSelection" :disabled="!tempCategory">
        Применить
      </BaseButton>
    </div>
  </div>
</template>
