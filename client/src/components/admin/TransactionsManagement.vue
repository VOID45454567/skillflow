<!-- components/admin/TransactionsManagement.vue -->
<template>
  <div class="space-y-4">
    <!-- Поиск и фильтры -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по ID, пользователю или курсу..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>
      <select
        v-model="filterType"
        class="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary outline-none"
      >
        <option value="all">Все типы</option>
        <option value="PURCHASE">Покупки</option>
        <option value="REFUND">Возвраты</option>
        <option value="GIFT">Подарки</option>
      </select>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-3">
      <div class="glass rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Всего транзакций</p>
        <p class="text-xl font-bold text-gray-800">{{ filteredTransactions.length }}</p>
      </div>
      <div class="glass rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Общая сумма</p>
        <p class="text-xl font-bold text-gray-800">{{ totalAmount }} 💎</p>
      </div>
      <div class="glass rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-1">Средний чек</p>
        <p class="text-xl font-bold text-gray-800">{{ averageAmount }} 💎</p>
      </div>
    </div>

    <!-- Таблица транзакций -->
    <div class="glass-strong rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/30 border-b border-gray-200/40">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Тип
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Курс
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
              v-for="tx in paginatedTransactions"
              :key="tx.id"
              class="hover:bg-white/20 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-600">#{{ tx.id }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getTypeClass(tx.type)"
                >
                  {{ getTypeLabel(tx.type) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="openUserModal(tx.user)"
                  class="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    v-if="tx.user?.avatarUrl"
                    :src="tx.user?.avatarUrl"
                    class="h-7 w-7 rounded-full object-cover"
                  />
                  <User v-else class="h-7 w-7 text-gray-400" />
                  <span class="text-sm text-primary hover:underline">
                    {{ tx.user?.login || "—" }}
                  </span>
                </button>
              </td>
              <td class="px-6 py-4 text-sm max-w-xs">
                <button
                  v-if="tx.course"
                  @click="openCourseModal(tx.course)"
                  class="text-primary hover:underline truncate block max-w-[200px]"
                >
                  {{ tx.course.title }}
                </button>
                <span v-else class="text-gray-600">—</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium" :class="getAmountClass(tx.type)">
                  {{ tx.type === "REFUND" ? "+" : "-" }}{{ tx.price || 0 }} 💎
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(tx.createdAt) }}
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

    <!-- Модалка пользователя -->
    <UserDetailsModal v-model="selectedUser" @close="selectedUser = null" />

    <!-- Модалка курса -->
    <CourseDetailsModal v-model="selectedCourse" @close="selectedCourse = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, ChevronLeft, ChevronRight, User } from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { TransactionType } from "@/types/enums/common-info";
import { formatDate } from "@/utils/formatters/formatDate";
import UserDetailsModal from "../modals/UserDetailsModal.vue";
import CourseDetailsModal from "../modals/CourseDetailsModal.vue";
import type { User as UserType } from "@/types/user";
import type { Course } from "@/types/course";

const store = useAdminStore();

const searchQuery = ref("");
const filterType = ref<"all" | TransactionType>("all");
const currentPage = ref(1);
const itemsPerPage = 20;
const selectedUser = ref<UserType | null>(null);
const selectedCourse = ref<Course | null>(null);

const filteredTransactions = computed(() => {
  let transactions = [...store.transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log(transactions);

  if (filterType.value !== "all") {
    transactions = transactions.filter((t) => t.type === filterType.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    transactions = transactions.filter(
      (t) =>
        t.id.toString().includes(query) ||
        t.user?.login?.toLowerCase().includes(query) ||
        t.course?.title?.toLowerCase().includes(query)
    );
  }

  return transactions;
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
);

const totalAmount = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => {
    if (t.type === "REFUND") return sum;
    return sum + (t.price || 0);
  }, 0);
});

const averageAmount = computed(() => {
  const purchaseTxs = filteredTransactions.value.filter((t) => t.type !== "REFUND");
  if (purchaseTxs.length === 0) return 0;
  return Math.round(totalAmount.value / purchaseTxs.length);
});

const getTypeClass = (type: TransactionType): string => {
  const classes: Record<TransactionType, string> = {
    PURCHASE: "bg-primary/10 text-primary",
    REFUND: "bg-emerald-100 text-emerald-700",
    GIFT: "bg-accent-pink/10 text-accent-pink",
  };
  return classes[type] || "bg-gray-100 text-gray-600";
};

const getTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    PURCHASE: "Покупка",
    REFUND: "Возврат",
    GIFT: "Подарок",
  };
  return labels[type] || type;
};

const getAmountClass = (type: TransactionType): string => {
  const classes: Record<TransactionType, string> = {
    PURCHASE: "text-rose-600",
    REFUND: "text-emerald-600",
    GIFT: "text-accent-pink",
  };
  return classes[type] || "text-gray-600";
};

const openUserModal = (user?: UserType) => {
  if (user) {
    selectedUser.value = user;
  }
};

const openCourseModal = (course: Course) => {
  selectedCourse.value = course;
};
</script>
