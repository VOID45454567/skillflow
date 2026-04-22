<!-- components/profile/HeatmapCard.vue -->
<template>
  <div class="glass-strong rounded-2xl p-5 animate-fadeInUp">
    <div class="flex items-center gap-3 mb-4">
      <div
        class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
      >
        <CalendarDays class="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 class="font-semibold text-gray-800">Активность</h3>
        <p class="text-xs text-gray-500">{{ currentMonthName }}</p>
      </div>
    </div>

    <!-- Тепловая карта -->
    <div v-if="heatmap.length" class="space-y-3">
      <!-- Дни недели -->
      <div class="grid grid-cols-7 gap-1.5">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-xs text-gray-400 font-medium"
        >
          {{ day }}
        </div>
      </div>

      <!-- Ячейки активности -->
      <div class="grid grid-cols-7 gap-1.5">
        <div v-for="(cell, index) in calendarGrid" :key="index" class="relative group">
          <div
            class="aspect-square rounded-lg transition-all"
            :class="[getCellClass(cell), cell ? 'cursor-help' : '']"
          ></div>

          <!-- Тултип -->
          <div
            v-if="cell && cell.actionsCount > 0"
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
          >
            <span class="font-medium">{{ formatDate(cell.date) }}</span>
            <span class="mx-1">·</span>
            <span>{{ cell.actionsCount }} {{ pluralizeActions(cell.actionsCount) }}</span>
          </div>
        </div>
      </div>

      <!-- Легенда -->
      <div class="flex items-center justify-end gap-2 pt-2">
        <span class="text-xs text-gray-400">Меньше</span>
        <div class="flex gap-1">
          <div class="w-3 h-3 rounded bg-gray-100"></div>
          <div class="w-3 h-3 rounded bg-primary/20"></div>
          <div class="w-3 h-3 rounded bg-primary/40"></div>
          <div class="w-3 h-3 rounded bg-primary/60"></div>
          <div class="w-3 h-3 rounded bg-primary"></div>
        </div>
        <span class="text-xs text-gray-400">Больше</span>
      </div>

      <!-- Статистика -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-200/60">
        <div class="flex items-center gap-2">
          <Flame class="h-4 w-4 text-orange-500" />
          <span class="text-sm text-gray-600">
            Всего действий: <strong>{{ totalActions }}</strong>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <TrendingUp class="h-4 w-4 text-emerald-500" />
          <span class="text-sm text-gray-600">
            В среднем: <strong>{{ averageActions }}/день</strong>
          </span>
        </div>
      </div>
    </div>

    <!-- Нет данных -->
    <div v-else class="text-center py-8">
      <CalendarDays class="h-10 w-10 text-gray-300 mx-auto mb-2" />
      <p class="text-sm text-gray-500">Нет данных об активности</p>
      <p class="text-xs text-gray-400 mt-1">Начните обучение, чтобы увидеть прогресс</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CalendarDays, Flame, TrendingUp } from "@lucide/vue";
import type { Heatmap } from "@/types/user/heatmap";

const props = defineProps<{
  heatmap: Heatmap[];
}>();

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const currentMonthName = computed(() => {
  return new Date().toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
});

const normalizeDate = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calendarGrid = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let firstDayOfWeek = firstDay.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const grid: (Heatmap | null)[] = [];

  // Пустые ячейки в начале
  for (let i = 0; i < firstDayOfWeek; i++) {
    grid.push(null);
  }

  const dataMap = new Map<string, Heatmap>();
  props.heatmap.forEach((item) => {
    const dateKey = normalizeDate(item.date);
    dataMap.set(dateKey, item);
  });

  // Заполняем дни месяца
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateKey = normalizeDate(date);
    const data = dataMap.get(dateKey);

    if (data) {
      grid.push(data);
    } else {
      grid.push({
        id: 0,
        userId: 0,
        actionsCount: 0,
        date: date.toISOString(),
      } as Heatmap);
    }
  }

  // Добиваем пустыми ячейками до конца недели
  const remainingCells = 7 - (grid.length % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      grid.push(null);
    }
  }

  return grid;
});

const totalActions = computed(() => {
  return props.heatmap.reduce((sum, item) => sum + (item.actionsCount || 0), 0);
});

const averageActions = computed(() => {
  const daysWithData = props.heatmap.filter((item) => item.actionsCount > 0).length;
  if (daysWithData === 0) return 0;
  return Math.round(totalActions.value / daysWithData);
});

const getCellClass = (cell: Heatmap | null): string => {
  if (!cell) return "bg-transparent";

  const count = cell.actionsCount || 0;

  // Фиолетовая цветовая гамма (как у кнопок primary)
  if (count === 0) return "bg-gray-100";
  if (count <= 3) return "bg-primary/20";
  if (count <= 6) return "bg-primary/40";
  if (count <= 10) return "bg-primary/60";
  return "bg-primary";
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
};

const pluralizeActions = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "действие";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "действия";
  return "действий";
};
</script>
