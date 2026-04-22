<script setup lang="ts">
import { Sparkles, Smartphone, BarChart3, ShieldCheck, ArrowUpRight } from "@lucide/vue";

const features = [
  {
    title: "AI-ассистент",
    desc: "Генерация контента и тестов за минуты",
    icon: Sparkles,
    span: "md:col-span-2",
    bg: "from-blue-50/80 to-indigo-50/80",
  },
  {
    title: "Мобильное приложение",
    desc: "Офлайн-доступ к материалам",
    icon: Smartphone,
    span: "md:col-span-1",
    bg: "from-slate-50/80 to-zinc-50/80",
  },
  {
    title: "Аналитика в реальном времени",
    desc: "Дашборды прогресса и ROI",
    icon: BarChart3,
    span: "md:col-span-1",
    bg: "from-slate-50/80 to-zinc-50/80",
  },
  {
    title: "SSO & Интеграции",
    desc: "Подключение к HR-системам за 1 клик",
    icon: ShieldCheck,
    span: "md:col-span-2",
    bg: "from-blue-50/80 to-sky-50/80",
  },
];
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-900">Возможности платформы</h2>
      <a
        href="#"
        class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >Все функции
        <ArrowUpRight class="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
      /></a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="f in features"
        :key="f.title"
        :class="[
          'p-6 rounded-[2rem] border border-white/70 flex flex-col justify-between h-full transition-all hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-br',
          f.bg,
          f.span,
        ]"
      >
        <div class="mb-4">
          <component :is="f.icon" class="h-8 w-8 text-slate-700 mb-3" />
          <h3 class="text-lg font-bold text-slate-900">{{ f.title }}</h3>
          <p class="text-sm text-slate-500 mt-1">{{ f.desc }}</p>
        </div>
        <button
          class="self-start text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >
          Подробнее
          <ArrowUpRight
            class="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  </section>
</template>
