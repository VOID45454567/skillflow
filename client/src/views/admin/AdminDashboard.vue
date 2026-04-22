<!-- views/AdminDashboard.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between animate-fadeInUp">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Админ-панель</h1>
          <p class="text-gray-500">Управление пользователями, транзакциями и системой</p>
        </div>
        <div class="flex items-center gap-2">
          <BaseButton variant="outlined" @click="refreshData" :disabled="loading">
            <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
            Обновить
          </BaseButton>
        </div>
      </div>

      <!-- Статистика -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeInUp"
        style="animation-delay: 0.1s"
      >
        <StatsCard
          title="Всего пользователей"
          :value="store.users.length"
          icon="Users"
          color="primary"
        />
        <StatsCard
          title="На верификации"
          :value="store.pendingVerificationUsers.length"
          icon="Shield"
          color="amber"
        />
        <StatsCard
          title="Транзакций"
          :value="store.totalTransactions"
          icon="ArrowLeftRight"
          color="accent"
        />
        <StatsCard
          title="Обороты"
          :value="`${store.totalBalance} 💎`"
          icon="Wallet"
          color="emerald"
        />

        <StatsCard
          title="Апелляций"
          :value="store.appeals?.length || 0"
          icon="MessageSquare"
          color="amber"
        />
      </div>

      <!-- Tabs -->
      <div
        class="glass rounded-2xl p-1 flex gap-1 animate-fadeInUp"
        style="animation-delay: 0.15s"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
          :class="
            activeTab === tab.id
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-600 hover:bg-white/40'
          "
        >
          <component :is="tab.icon" class="h-4 w-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Контент вкладок -->
      <div class="animate-fadeInUp" style="animation-delay: 0.2s">
        <UsersManagement v-if="activeTab === 'users'" />

        <VerificationManagement v-else-if="activeTab === 'verification'" />

        <TransactionsManagement v-else-if="activeTab === 'transactions'" />

        <PaymentsManagement v-else-if="activeTab === 'payments'" />

        <LogsManagement v-else-if="activeTab === 'logs'" />

        <AppealsManagement v-else-if="activeTab === 'appeals'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Users,
  Shield,
  ArrowLeftRight,
  RefreshCw,
  CreditCard,
  History,
  MessageSquare,
} from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { useToast } from "@/composables/useToast";
import BaseButton from "@/components/ui/AppButton.vue";
import StatsCard from "@/components/admin/StatsCard.vue";
import UsersManagement from "@/components/admin/UsersManagement.vue";
import VerificationManagement from "@/components/admin/VerificationManagement.vue";
import TransactionsManagement from "@/components/admin/TransactionsManagement.vue";
import PaymentsManagement from "@/components/admin/PaymentsManagement.vue";
import LogsManagement from "@/components/admin/LogsManagement.vue";
import AppealsManagement from "@/components/admin/AppealsManagement.vue";
const store = useAdminStore();
const toast = useToast();

const loading = ref(false);
const activeTab = ref<
  "users" | "verification" | "transactions" | "payments" | "logs" | "appeals"
>("users");

const tabs = [
  { id: "users" as const, label: "Пользователи", icon: Users },
  { id: "verification" as const, label: "Верификация", icon: Shield },
  { id: "appeals" as const, label: "Апелляции", icon: MessageSquare },
  { id: "transactions" as const, label: "Транзакции", icon: ArrowLeftRight },
  { id: "payments" as const, label: "Платежи", icon: CreditCard },
  { id: "logs" as const, label: "Логи", icon: History },
];
onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    await store.fetchAllData();
  } catch (error) {
    toast.error("Ошибка загрузки данных");
  } finally {
    loading.value = false;
  }
};

const refreshData = async () => {
  await loadData();
  toast.success("Данные обновлены");
};
</script>
