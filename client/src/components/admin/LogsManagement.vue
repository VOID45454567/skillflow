<!-- components/admin/LogsManagement.vue -->
<template>
  <div class="space-y-4">
    <!-- Фильтры -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по администратору, пользователю или причине..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>
      <select
        v-model="filterAction"
        class="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary outline-none"
      >
        <option value="all">Все действия</option>
        <option :value="AdminActionTypes.BAN">Блокировки</option>
        <option :value="AdminActionTypes.UNBAN">Разблокировки</option>
        <option :value="AdminActionTypes.VERIFY">Верификации</option>
        <option :value="AdminActionTypes.DENY">Отказы</option>
      </select>
    </div>

    <!-- Таблица логов -->
    <div class="glass-strong rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/30 border-b border-gray-200/40">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Администратор
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Действие
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Причина
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/40">
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="hover:bg-white/20 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-600">#{{ log.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <img
                    :src="log.admin?.avatarUrl || '/placeholder-avatar.png'"
                    class="h-7 w-7 rounded-full object-cover"
                  />
                  <span class="text-sm text-gray-700">{{ log.admin?.login || "—" }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getActionClass(log.actionType)"
                >
                  {{ getActionLabel(log.actionType) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">ID: {{ log.targetUserId }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ log.reason || "—" }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(log.createdAt) }}
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
import { Search, ChevronLeft, ChevronRight } from "@lucide/vue";
import { useAdminStore } from "@/stores/admin";
import { AdminActionTypes } from "@/types/enums/admin-action-types";

const store = useAdminStore();

const searchQuery = ref("");
const filterAction = ref<"all" | AdminActionTypes>("all");
const currentPage = ref(1);
const itemsPerPage = 20;

const filteredLogs = computed(() => {
  let logs = [...store.logs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Фильтр по действию
  if (filterAction.value !== "all") {
    logs = logs.filter((l) => l.actionType === filterAction.value);
  }

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.admin?.login?.toLowerCase().includes(query) ||
        l.targetUserId.toString().includes(query) ||
        l.reason?.toLowerCase().includes(query)
    );
  }

  return logs;
});

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredLogs.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage));

const getActionClass = (action: AdminActionTypes): string => {
  switch (action) {
    case AdminActionTypes.BAN:
      return "bg-rose-100 text-rose-700";
    case AdminActionTypes.UNBAN:
      return "bg-emerald-100 text-emerald-700";
    case AdminActionTypes.VERIFY:
      return "bg-primary/10 text-primary";
    case AdminActionTypes.DENY:
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getActionLabel = (action: AdminActionTypes): string => {
  switch (action) {
    case AdminActionTypes.BAN:
      return "Блокировка";
    case AdminActionTypes.UNBAN:
      return "Разблокировка";
    case AdminActionTypes.VERIFY:
      return "Верификация";
    case AdminActionTypes.DENY:
      return "Отказ";
    default:
      return "Неизвестно";
  }
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
