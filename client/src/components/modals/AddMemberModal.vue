<!-- components/organization/dashboard/AddMemberModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="close" width="lg">
    <div class="space-y-5">
      <!-- Заголовок -->
      <div class="text-center mb-2">
        <div
          class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3"
        >
          <UserPlus class="h-7 w-7 text-primary" />
        </div>
        <h3 class="text-lg font-bold text-gray-800">Добавить участника</h3>
        <p class="text-sm text-gray-500 mt-1">Найдите пользователя по логину или email</p>
      </div>

      <!-- Поиск -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Введите логин или email..."
          class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          @input="handleSearch"
        />
        <Loader2
          v-if="searching"
          class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin"
        />
      </div>

      <!-- Результаты поиска -->
      <div v-if="searchQuery" class="max-h-80 overflow-y-auto">
        <div v-if="searchResults.length" class="space-y-2">
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="flex items-center justify-between p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-colors"
          >
            <div class="flex items-center gap-3">
              <img
                :src="user.avatarUrl || '/placeholder-avatar.png'"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <span class="font-medium text-gray-800">{{ user.login }}</span>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>
            <BaseButton
              size="sm"
              :disabled="addingUserId === user.id"
              @click="addUser(user.id)"
            >
              <Loader2
                v-if="addingUserId === user.id"
                class="h-4 w-4 mr-1 animate-spin"
              />
              <Plus v-else class="h-4 w-4 mr-1" />
              {{ addingUserId === user.id ? "Добавление..." : "Добавить" }}
            </BaseButton>
          </div>
        </div>

        <div v-else-if="!searching && searchQuery.length >= 2" class="text-center py-8">
          <Search class="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p class="text-gray-500">Пользователи не найдены</p>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="text-center py-8">
        <Search class="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">Введите запрос для поиска пользователей</p>
      </div>

      <!-- Информация о приглашении -->
      <div class="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
        <p class="text-xs text-gray-600 flex items-start gap-2">
          <Mail class="h-4 w-4 text-accent-cyan shrink-0 mt-0.5" />
          <span>
            Вы также можете отправить приглашение на email пользователя.
            <button
              @click="switchToInvite"
              class="text-accent-cyan hover:underline font-medium"
            >
              Перейти к отправке приглашения
            </button>
          </span>
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Search, UserPlus, Plus, Mail, Loader2 } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { useToast } from "@/composables/useToast";
import { API } from "@/api";
import { useOrganizationStore } from "@/stores/organization";

const props = defineProps<{
  modelValue: boolean;
  organizationId: number;
  ownerEmail: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  added: [];
  switchToInvite: [];
}>();

const orgStore = useOrganizationStore();
const toast = useToast();

const searchQuery = ref("");
const searching = ref(false);
const searchResults = ref<any[]>([]);
const addingUserId = ref<number | null>(null);

let searchTimeout: any;

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);

const resetForm = () => {
  searchQuery.value = "";
  searchResults.value = [];
  addingUserId.value = null;
};

const handleSearch = () => {
  clearTimeout(searchTimeout);

  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  searching.value = true;
  searchTimeout = setTimeout(async () => {
    try {
    } catch (error) {
      toast.error("Ошибка при поиске пользователей");
    } finally {
      searching.value = false;
    }
  }, 300);
};

const addUser = async (userId: number) => {
  addingUserId.value = userId;
  try {
    await orgStore.addMember(props.organizationId, userId);
    toast.success("Пользователь добавлен в организацию");
    emit("added");
    close();
  } catch (error: any) {
    if (error?.response?.status === 409) {
      toast.error("Пользователь уже состоит в организации");
    } else {
      toast.error("Не удалось добавить пользователя");
    }
  } finally {
    addingUserId.value = null;
  }
};

const switchToInvite = () => {
  close();
  emit("switchToInvite");
};

const close = () => {
  emit("update:modelValue", false);
};
</script>
