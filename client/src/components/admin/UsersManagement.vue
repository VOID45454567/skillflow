<!-- components/admin/UsersManagement.vue -->
<template>
  <div class="space-y-4">
    <!-- Поиск и фильтры -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по логину или email..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>
      <select
        v-model="filterStatus"
        class="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary outline-none"
      >
        <option value="all">Все</option>
        <option value="blocked">Заблокированные</option>
        <option value="active">Активные</option>
        <option value="verified">Верифицированные</option>
      </select>
    </div>

    <!-- Таблица пользователей -->
    <div class="glass-strong rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/30 border-b border-gray-200/40">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Роль
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Баланс
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                2FA
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/40">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-white/20 transition-colors"
            >
              <td class="px-6 py-4">
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
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  "
                >
                  {{ user.role === "ADMIN" ? "Админ" : "Пользователь" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <span
                    v-if="!user.bannedByUsers?.length"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getVerificationClass(user.verificationStatus)"
                  >
                    {{ mapVerificationStatus(user.verificationStatus) }}
                  </span>
                  <span
                    v-else
                    class="px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 block w-fit"
                  >
                    Заблокирован
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-700">
                {{ user.balance }} 💎
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="
                    user.enabledTwoFactor
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ user.enabledTwoFactor ? "Включена" : "Отключена" }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton size="sm" variant="ghost" @click="selectedUser = user">
                    <Eye class="h-4 w-4" />
                  </BaseButton>
                  <BaseButton
                    v-if="!user.bannedByUsers?.length"
                    size="sm"
                    variant="ghost"
                    class="text-rose-500 hover:bg-rose-50"
                    @click="openBlockModal(user)"
                  >
                    <Ban class="h-4 w-4" />
                  </BaseButton>
                  <BaseButton
                    v-else
                    size="sm"
                    variant="ghost"
                    class="text-emerald-500 hover:bg-emerald-50"
                    @click="openUnblockModal(user)"
                  >
                    <CheckCircle class="h-4 w-4" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UserDetailsModal v-model="selectedUser!" @close="selectedUser = null" />

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
import { ref, computed, reactive } from "vue";
import { Search, Eye, Ban, CheckCircle } from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { useToast } from "@/composables/useToast";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import BaseButton from "@/components/ui/AppButton.vue";
import UserDetailsModal from "../modals/UserDetailsModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import type { User } from "@/types/user";

const store = useAdminStore();
const toast = useToast();

const searchQuery = ref("");
const filterStatus = ref<"all" | "blocked" | "active" | "verified">("all");
const selectedUser = ref<User | null>(null);

const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  type: "info" as "warning" | "info" | "danger" | "success",
  confirmText: "Подтвердить",
  requireReason: false,
  reasonPlaceholder: "",
  onConfirm: (_reason: string) => {},
});

const filteredUsers = computed(() => {
  let users = [...store.users];

  if (filterStatus.value === "blocked") {
    users = users.filter((u) => u.bannedByUsers?.length > 0);
  } else if (filterStatus.value === "active") {
    users = users.filter((u) => !u.bannedByUsers?.length);
  } else if (filterStatus.value === "verified") {
    users = users.filter((u) => u.verificationStatus === "VERIFIED");
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(
      (u) =>
        u.login.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }

  return users;
});

const getVerificationClass = (status: UserVerificationStatuses): string => {
  const classes: Record<UserVerificationStatuses, string> = {
    VERIFIED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    REJECTED: "bg-rose-100 text-rose-700",
    UNVERIFIED: "bg-gray-100 text-gray-600",
  };
  return classes[status] || "bg-gray-100 text-gray-600";
};

const mapVerificationStatus = (status: UserVerificationStatuses): string => {
  const map: Record<UserVerificationStatuses, string> = {
    VERIFIED: "Верифицирован",
    PENDING: "На проверке",
    REJECTED: "Отклонен",
    UNVERIFIED: "Не верифицирован",
  };
  return map[status] || status;
};

const openBlockModal = (user: User) => {
  confirmModal.show = true;
  confirmModal.title = "Блокировка пользователя";
  confirmModal.message = `Вы уверены, что хотите заблокировать пользователя "${user.login}"?`;
  confirmModal.type = "danger";
  confirmModal.confirmText = "Заблокировать";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину блокировки...";
  confirmModal.onConfirm = async (reason: string) => {
    const success = await store.blockUser(user.id, reason!);
    if (success) {
      toast.success(`Пользователь ${user.login} заблокирован`);
    } else {
      toast.error("Ошибка блокировки");
    }
    confirmModal.show = false;
  };
};

const openUnblockModal = (user: User) => {
  confirmModal.show = true;
  confirmModal.title = "Разблокировка пользователя";
  confirmModal.message = `Вы уверены, что хотите разблокировать пользователя "${user.login}"?`;
  confirmModal.type = "success";
  confirmModal.confirmText = "Разблокировать";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину разблокировки...";
  confirmModal.onConfirm = async (reason?: string) => {
    const success = await store.unblockUser(user.id, reason!);
    if (success) {
      toast.success(`Пользователь ${user.login} разблокирован`);
    } else {
      toast.error("Ошибка разблокировки");
    }
    confirmModal.show = false;
  };
};
</script>
