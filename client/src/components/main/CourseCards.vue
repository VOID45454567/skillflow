<script setup lang="ts">
import { Clock } from "@lucide/vue";

const courses = [
  {
    title: "Управление продуктом",
    author: "Анна К., Senior PM",
    progress: 78,
    students: 1240,
    tag: "Бизнес",
  },
  {
    title: "Python для аналитики",
    author: "Дмитрий В., Data Lead",
    progress: 42,
    students: 3400,
    tag: "IT",
  },
  {
    title: "Лидерство и коммуникации",
    author: "Елена М., HR Director",
    progress: 15,
    students: 890,
    tag: "Soft Skills",
  },
];
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Популярные курсы</h2>
      <a
        href="#"
        class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >Все курсы
        <ChevronRight class="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
      /></a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div
        v-for="c in courses"
        :key="c.title"
        class="surface-card rounded-[2rem] border border-white/70 p-5 hover:shadow-xl hover:-translate-y-1 transition-all group"
      >
        <div class="flex items-center justify-between mb-4">
          <span
            class="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full"
            >{{ c.tag }}</span
          >
          <Clock class="h-4 w-4 text-slate-400" />
        </div>
        <h3
          class="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors"
        >
          {{ c.title }}
        </h3>
        <p class="text-sm text-slate-500 mb-4">
          {{ c.author }} · {{ c.students }} студентов
        </p>
        <div class="mb-4">
          <div class="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Прогресс</span><span>{{ c.progress }}%</span>
          </div>
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 rounded-full transition-all duration-500"
              :style="{ width: `${c.progress}%` }"
            />
          </div>
        </div>
        <button
          class="w-full py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          Продолжить
        </button>
      </div>
    </div>
  </section>
</template>
