<!-- components/admin/VerificationManagement.vue -->
<template>
  <div class="space-y-4">
    <div
      v-if="!store.pendingVerificationUsers.length"
      class="glass-strong rounded-2xl p-12 text-center"
    >
      <Shield class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Нет заявок на верификацию</h3>
      <p class="text-gray-500">Все пользователи уже обработаны</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="user in store.pendingVerificationUsers"
        :key="user.id"
        class="glass-strong rounded-xl p-5"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <img
              :src="user.avatarUrl || '/placeholder-avatar.png'"
              class="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h4 class="font-semibold text-gray-800">{{ user.login }}</h4>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
              <p class="text-xs text-gray-400 mt-1">
                Дата регистрации: {{ formatDate(user.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <BaseButton size="sm" variant="outlined" @click="selectedUser = user">
              <Eye class="h-4 w-4 mr-1" />
              Подробнее
            </BaseButton>
            <BaseButton size="sm" @click="openApproveModal(user)">
              <CheckCircle class="h-4 w-4 mr-1" />
              Подтвердить
            </BaseButton>
            <BaseButton
              size="sm"
              variant="outlined"
              class="text-rose-500"
              @click="openRejectModal(user)"
            >
              <XCircle class="h-4 w-4 mr-1" />
              Отклонить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <UserDetailsModal v-model="selectedUser" @close="selectedUser = null" />

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
import { ref, reactive } from "vue";
import { Shield, Eye, CheckCircle, XCircle } from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { useToast } from "@/composables/useToast";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import BaseButton from "@/components/ui/AppButton.vue";
import UserDetailsModal from "../modals/UserDetailsModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import type { User } from "@/types/user";
import { AdminActionTypes } from "@/types/enums/admin-action-types";

const store = useAdminStore();
const toast = useToast();

const selectedUser = ref<User | null>(null);

const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  type: "info" as "warning" | "info" | "danger" | "success",
  confirmText: "Подтвердить",
  requireReason: true,
  reasonPlaceholder: "",
  onConfirm: (_reason: string) => {},
});

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const openApproveModal = (user: User) => {
  confirmModal.show = true;
  confirmModal.title = "Подтверждение верификации";
  confirmModal.message = `Подтвердить верификацию пользователя "${user.login}"?`;
  confirmModal.type = "success";
  confirmModal.confirmText = "Подтвердить";
  confirmModal.requireReason = true;
  confirmModal.onConfirm = async (reason: string) => {
    const success = await store.setVerificationStatus(
      user.id,
      UserVerificationStatuses.VERIFIED,
      reason,
      AdminActionTypes.VERIFY
    );
    if (success) {
      toast.success(`Верификация пользователя ${user.login} подтверждена`);
    } else {
      toast.error("Ошибка подтверждения");
    }
    confirmModal.show = false;
  };
};

const openRejectModal = (user: User) => {
  confirmModal.show = true;
  confirmModal.title = "Отклонение верификации";
  confirmModal.message = `Отклонить верификацию пользователя "${user.login}"?`;
  confirmModal.type = "danger";
  confirmModal.confirmText = "Отклонить";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину отклонения верификации...";
  confirmModal.onConfirm = async (reason: string) => {
    console.log("Reject reason:", reason);
    const success = await store.setVerificationStatus(
      user.id,
      UserVerificationStatuses.REJECTED,
      reason,
      AdminActionTypes.DENY
    );
    if (success) {
      toast.success(`Верификация пользователя ${user.login} отклонена`);
    } else {
      toast.error("Ошибка отклонения");
    }
    confirmModal.show = false;
  };
};
</script>
