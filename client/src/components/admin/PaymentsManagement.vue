<!-- components/admin/PaymentsManagement.vue -->
<template>
  <div class="space-y-4">
    <!-- Поиск -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по ID или пользователю..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="glass rounded-xl p-4">
        <div class="flex items-center gap-2 mb-2">
          <CreditCard class="h-4 w-4 text-primary" />
          <p class="text-xs text-gray-500">Всего платежей</p>
        </div>
        <p class="text-xl font-bold text-gray-800">{{ filteredPayments.length }}</p>
      </div>
      <div class="glass rounded-xl p-4">
        <div class="flex items-center gap-2 mb-2">
          <Wallet class="h-4 w-4 text-emerald-500" />
          <p class="text-xs text-gray-500">Общая сумма</p>
        </div>
        <p class="text-xl font-bold text-gray-800">{{ totalAmount }} 💎</p>
      </div>
      <div class="glass rounded-xl p-4">
        <div class="flex items-center gap-2 mb-2">
          <TrendingUp class="h-4 w-4 text-accent-cyan" />
          <p class="text-xs text-gray-500">По методам</p>
        </div>
        <div class="text-sm">
          <div class="flex justify-between">
            <span>💳 Карта:</span>
            <span class="font-medium">{{ cardPayments }}</span>
          </div>
          <div class="flex justify-between">
            <span>📱 СБП:</span>
            <span class="font-medium">{{ sbpPayments }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица платежей -->
    <div class="glass-strong rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/30 border-b border-gray-200/40">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Метод
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Сумма
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/40">
            <tr
              v-for="payment in paginatedPayments"
              :key="payment.id"
              class="hover:bg-white/20 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-600">#{{ payment.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <img
                    :src="payment.user?.avatarUrl || '/placeholder-avatar.png'"
                    class="h-7 w-7 rounded-full object-cover"
                  />
                  <div>
                    <span class="text-sm text-gray-700">{{
                      payment.user?.login || "—"
                    }}</span>
                    <p class="text-xs text-gray-400">{{ payment.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getMethodClass(payment.method)"
                >
                  {{ getMethodLabel(payment.method) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-emerald-600">
                  +{{ payment.count }} 💎
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(payment.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Пагинация -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="w-8 h-8 rounded-lg glass flex items-center justify-center disabled:opacity-50"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      <span class="text-sm text-gray-500"> {{ currentPage }} / {{ totalPages }} </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="w-8 h-8 rounded-lg glass flex items-center justify-center disabled:opacity-50"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Search,
  CreditCard,
  Wallet,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { PaymentMethod } from "@/types/enums/common-info";

const store = useAdminStore();

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;

const filteredPayments = computed(() => {
  let payments = [...store.payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    payments = payments.filter(
      (p) =>
        p.id.toString().includes(query) ||
        p.user?.login?.toLowerCase().includes(query) ||
        p.user?.email?.toLowerCase().includes(query)
    );
  }

  return payments;
});

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPayments.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredPayments.value.length / itemsPerPage)
);

const totalAmount = computed(() => {
  return filteredPayments.value.reduce((sum, p) => sum + p.count, 0);
});

const cardPayments = computed(() => {
  return filteredPayments.value.filter((p) => p.method === "CARD").length;
});

const sbpPayments = computed(() => {
  return filteredPayments.value.filter((p) => p.method === "SBP").length;
});

const getMethodClass = (method: PaymentMethod): string => {
  const classes: Record<PaymentMethod, string> = {
    CARD: "bg-primary/10 text-primary",
    SBP: "bg-accent-cyan/10 text-accent-cyan",
  };
  return classes[method] || "bg-gray-100 text-gray-600";
};

const getMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    CARD: "Банковская карта",
    SBP: "СБП",
  };
  return labels[method] || method;
};

const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
