<!-- components/admin/modals/TermActionsModal.vue -->
<template>
  <Modal :model-value="modelValue" width="sm" @close="$emit('close')">
    <div class="space-y-5">
      <div class="text-center">
        <div
          class="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3"
        >
          <component
            :is="activeInnerTab === 'categories' ? Folder : Tag"
            class="h-7 w-7 text-primary"
          />
        </div>
        <h3 class="text-lg font-bold text-gray-800">
          {{ editingTerm ? "Редактирование" : "Создание" }}
          {{ activeInnerTab === "categories" ? "категории" : "тега" }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          {{ editingTerm ? "Измените название" : "Введите название нового термина" }}
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600">Название</label>
        <input
          v-model="formName"
          type="text"
          :placeholder="
            activeInnerTab === 'categories'
              ? 'Например: Программирование'
              : 'Например: JavaScript'
          "
          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          :class="{
            'border-rose-500 focus:border-rose-500 focus:ring-rose-200': formError,
          }"
          @keydown.enter="handleSubmit"
        />
        <p v-if="formError" class="text-xs text-rose-500">{{ formError }}</p>
      </div>

      <!-- Информация -->
      <div
        class="p-4 rounded-xl"
        :class="
          activeInnerTab === 'categories'
            ? 'bg-primary/5 border border-primary/10'
            : 'bg-accent-cyan/5 border border-accent-cyan/20'
        "
      >
        <div class="flex items-start gap-3">
          <Info
            class="h-5 w-5 shrink-0 mt-0.5"
            :class="activeInnerTab === 'categories' ? 'text-primary' : 'text-accent-cyan'"
          />
          <p class="text-xs text-gray-600">
            {{
              activeInnerTab === "categories"
                ? "Категории используются для группировки курсов по тематикам. Каждый курс может иметь только одну категорию."
                : "Теги дополняют категории и помогают точнее описать содержание курса. Курс может иметь несколько тегов."
            }}
          </p>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <BaseButton variant="outlined" class="flex-1" @click="$emit('close')">
          Отмена
        </BaseButton>
        <BaseButton class="flex-1" :disabled="!formName.trim()" @click="handleSubmit">
          {{ editingTerm ? "Сохранить" : "Создать" }}
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Folder, Tag, Info } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import type { CourseTerm, Term } from "@/types/course/course-term";
import { TermType } from "@/types/enums/common-info";

const props = defineProps<{
  modelValue: boolean;
  activeInnerTab: "categories" | "tags";
  editingTerm?: CourseTerm | null;
  formError: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
  "submit-form-data": [name: string, type: Term];
}>();

const formName = ref("");

// Заполняем поле при открытии
watch(
  () => props.editingTerm,
  (term) => {
    formName.value = term?.name || "";
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!formName.value.trim()) return;

  const type = props.activeInnerTab === "categories" ? TermType.CATEGORY : TermType.TAG;

  emit("submit-form-data", formName.value.trim(), type);
};
</script>
