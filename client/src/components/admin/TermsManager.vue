<!-- components/admin/TermsManagement.vue -->
<template>
  <div class="space-y-6">
    <!-- Вкладки Категории / Теги -->
    <div class="flex gap-2 border-b border-gray-200/40 pb-2">
      <button
        v-for="tab in innerTabs"
        :key="tab.id"
        @click="activeInnerTab = tab.id"
        class="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
        :class="
          activeInnerTab === tab.id
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-gray-500 hover:bg-white/30'
        "
      >
        <component :is="tab.icon" class="h-4 w-4" /> {{ tab.label }}
        <span
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="
            activeInnerTab === tab.id
              ? 'bg-white/20 text-white'
              : 'bg-gray-200 text-gray-600'
          "
        >
          {{ tab.id === "categories" ? categories.length : tags.length }}
        </span>
      </button>
    </div>

    <!-- Заголовок и кнопка создания -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
        >
          <component
            :is="activeInnerTab === 'categories' ? Folder : Tag"
            class="h-5 w-5 text-primary"
          />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800">
            {{ activeInnerTab === "categories" ? "Категории" : "Теги" }}
          </h3>
          <p class="text-sm text-gray-500">
            {{
              activeInnerTab === "categories"
                ? "Управление категориями курсов"
                : "Управление тегами курсов"
            }}
          </p>
        </div>
      </div>
      <BaseButton @click="openCreateModal">
        <Plus class="h-4 w-4 mr-2" />
        {{ activeInnerTab === "categories" ? "Создать категорию" : "Создать тег" }}
      </BaseButton>
    </div>

    <!-- Пустое состояние -->
    <div v-if="!currentItems.length" class="glass-strong rounded-2xl p-12 text-center">
      <component
        :is="activeInnerTab === 'categories' ? Folder : Tag"
        class="h-16 w-16 text-gray-300 mx-auto mb-4"
      />
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        {{ activeInnerTab === "categories" ? "Нет категорий" : "Нет тегов" }}
      </h3>
      <p class="text-gray-500 mb-6">
        {{
          activeInnerTab === "categories"
            ? "Создайте первую категорию для курсов"
            : "Создайте первый тег для курсов"
        }}
      </p>
      <BaseButton @click="openCreateModal">
        <Plus class="h-4 w-4 mr-2" />
        {{ activeInnerTab === "categories" ? "Создать категорию" : "Создать тег" }}
      </BaseButton>
    </div>

    <!-- Таблица -->
    <div v-else class="glass-strong rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/30 border-b border-gray-200/40">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Название
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Тип
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/40">
            <tr
              v-for="item in currentItems"
              :key="item.id"
              class="hover:bg-white/20 transition-colors group"
            >
              <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ item.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-8 w-8 rounded-lg flex items-center justify-center"
                    :class="
                      item.type === 'CATEGORY' ? 'bg-primary/10' : 'bg-accent-cyan/10'
                    "
                  >
                    <component
                      :is="item.type === 'CATEGORY' ? Folder : Tag"
                      class="h-4 w-4"
                      :class="
                        item.type === 'CATEGORY' ? 'text-primary' : 'text-accent-cyan'
                      "
                    />
                  </div>
                  <span class="font-medium text-gray-800">{{ item.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="
                    item.type === 'CATEGORY'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent-cyan/10 text-accent-cyan'
                  "
                >
                  {{ item.type === "CATEGORY" ? "Категория" : "Тег" }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton size="sm" variant="ghost" @click="openEditModal(item)">
                    <Edit class="h-4 w-4" />
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="ghost"
                    class="text-rose-500 hover:bg-rose-50"
                    @click="openDeleteModal(item)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модалка создания/редактирования -->
    <TermActionsModal
      :model-value="showFormModal"
      :active-inner-tab="activeInnerTab"
      :editing-term="editingTerm"
      :form-error="formError"
      @close="closeFormModal"
      @submit-form-data="handleFormSubmit"
    />

    <!-- Модалка подтверждения удаления -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Удаление термина"
      :message="`Вы уверены, что хотите удалить ${
        activeInnerTab === 'categories' ? 'категорию' : 'тег'
      } «${deletingTerm?.name}»? Это действие нельзя отменить.`"
      type="danger"
      confirm-text="Удалить"
      @confirm="handleDelete"
      @close="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Folder, Tag, Plus, Edit, Trash2 } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import TermActionsModal from "../modals/TermActionsModal.vue";
import type { CourseTerm, Term } from "@/types/course/course-term";
import { useAdminStore } from "@/stores/admin";

const adminStore = useAdminStore();

const activeInnerTab = ref<"categories" | "tags">("categories");
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editingTerm = ref<CourseTerm | null>(null);
const deletingTerm = ref<CourseTerm | null>(null);
const formError = ref("");

onMounted(async () => {
  await adminStore.getCategories();
  await adminStore.getTags();
});

const innerTabs = [
  { id: "categories" as const, label: "Категории", icon: Folder },
  { id: "tags" as const, label: "Теги", icon: Tag },
];

const categories = computed(() => adminStore.categories);
const tags = computed(() => adminStore.tags);

const currentItems = computed(() =>
  activeInnerTab.value === "categories" ? categories.value : tags.value
);

const openCreateModal = () => {
  editingTerm.value = null;
  formError.value = "";
  showFormModal.value = true;
};

const openEditModal = (term: CourseTerm) => {
  editingTerm.value = term;
  formError.value = "";
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingTerm.value = null;
  formError.value = "";
};

const openDeleteModal = (term: CourseTerm) => {
  deletingTerm.value = term;
  showDeleteModal.value = true;
};

const handleFormSubmit = async (name: string, type: Term) => {
  if (!name.trim()) {
    formError.value = "Название обязательно";
    return;
  }
  if (name.trim().length < 2) {
    formError.value = "Минимум 2 символа";
    return;
  }

  // Создание или редактирование
  if (editingTerm.value) {
    await adminStore.updateTerm(name, editingTerm.value.id);
  } else {
    await adminStore.createTerm(type, name);
  }

  closeFormModal();
};

const handleDelete = async () => {
  if (!deletingTerm.value) return;
  await adminStore.deleteTerm(deletingTerm.value.id);
  showDeleteModal.value = false;
  deletingTerm.value = null;
};
</script>
