<!-- components/admin/AppealsManagement.vue -->
<template>
  <div class="space-y-4">
    <!-- Поиск -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по пользователю или тексту апелляции..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
    </div>

    <!-- Список апелляций -->
    <div v-if="!filteredAppeals.length" class="glass-strong rounded-2xl p-12 text-center">
      <MessageSquare class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Нет апелляций</h3>
      <p class="text-gray-500">Пользователи пока не подавали жалоб на блокировку</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="appeal in filteredAppeals"
        :key="appeal.id"
        class="glass-strong rounded-xl p-5"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4 flex-1">
            <div class="p-3 rounded-xl bg-amber-500/10 shrink-0">
              <MessageSquare class="h-6 w-6 text-amber-500" />
            </div>

            <div class="flex-1 min-w-0">
              <!-- Информация о пользователе -->
              <div class="flex items-center gap-3 mb-3">
                <button
                  @click="openUserModal(appeal.user)"
                  class="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    :src="appeal.user?.avatarUrl || '/placeholder-avatar.png'"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <span class="font-medium text-primary hover:underline">
                    {{ appeal.user?.login }}
                  </span>
                </button>
                <span class="text-xs text-gray-400">
                  {{ formatDate(appeal.createdAt) }}
                </span>
              </div>

              <!-- Текст апелляции -->
              <div class="p-4 bg-white/40 rounded-xl">
                <p class="text-sm text-gray-700">{{ appeal.text }}</p>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="flex items-center gap-2 ml-4 shrink-0">
            <BaseButton size="sm" @click="openUnblockModal(appeal)">
              <CheckCircle class="h-4 w-4 mr-1" />
              Разблокировать
            </BaseButton>
            <BaseButton
              size="sm"
              variant="outlined"
              class="text-rose-500"
              @click="openRejectModal(appeal)"
            >
              <XCircle class="h-4 w-4 mr-1" />
              Отклонить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка пользователя -->
    <UserDetailsModal v-model="selectedUser" @close="selectedUser = null" />

    <!-- Модалка подтверждения -->
    <ConfirmModal
      v-model="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirm-text="confirmModal.confirmText"
      :require-reason="confirmModal.requireReason"
      :reason-placeholder="confirmModal.reasonPlaceholder"
      @confirm="confirmModal.onConfirm"
      @close="confirmModal.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { Search, MessageSquare, CheckCircle, XCircle } from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { useToast } from "@/composables/useToast";
import BaseButton from "@/components/ui/AppButton.vue";
import UserDetailsModal from "../modals/UserDetailsModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { formatDate } from "@/utils/formatters/formatDate";
import type { Appeal } from "@/types/appeal";
import type { User as UserType } from "@/types/user";

const store = useAdminStore();
const toast = useToast();

const searchQuery = ref("");
const selectedUser = ref<UserType | null>(null);

const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  type: "info" as "warning" | "info" | "danger" | "success",
  confirmText: "Подтвердить",
  requireReason: true,
  reasonPlaceholder: "",
  onConfirm: (_reason?: string) => {},
});

const filteredAppeals = computed(() => {
  let appeals = [...(store.appeals || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    appeals = appeals.filter(
      (a) =>
        a.user?.login?.toLowerCase().includes(query) ||
        a.text.toLowerCase().includes(query)
    );
  }

  return appeals;
});

const openUserModal = (user?: UserType) => {
  if (user) {
    selectedUser.value = user;
  }
};

const openUnblockModal = (appeal: Appeal) => {
  confirmModal.show = true;
  confirmModal.title = "Разблокировка пользователя";
  confirmModal.message = `Разблокировать пользователя "${appeal.user?.login}" на основании апелляции?`;
  confirmModal.type = "success";
  confirmModal.confirmText = "Разблокировать";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину разблокировки...";
  confirmModal.onConfirm = async (reason?: string) => {
    // Разблокируем пользователя
    const success = await store.unblockUser(
      appeal.userId,
      reason || "Апелляция удовлетворена"
    );

    if (success) {
      toast.success(`Пользователь ${appeal.user?.login} разблокирован`);
      await store.fetchAppeals();
    } else {
      toast.error("Ошибка разблокировки");
    }
    confirmModal.show = false;
  };
};

const openRejectModal = (appeal: Appeal) => {
  confirmModal.show = true;
  confirmModal.title = "Отклонение апелляции";
  confirmModal.message = `Отклонить апелляцию пользователя "${appeal.user?.login}"?`;
  confirmModal.type = "danger";
  confirmModal.confirmText = "Отклонить";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину отклонения...";
  confirmModal.onConfirm = async (reason?: string) => {
    // Здесь можно добавить удаление апелляции или отметку как отклоненной
    // Пока просто показываем уведомление и обновляем список
    toast.info(
      `Апелляция пользователя ${appeal.user?.login} отклонена. Причина: ${
        reason || "Не указана"
      }`
    );
    await store.fetchAppeals();
    confirmModal.show = false;
  };
};

onMounted(async () => {
  await store.fetchAppeals();
});
</script>
