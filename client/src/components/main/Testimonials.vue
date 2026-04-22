<script setup lang="ts">
import { Quote, Star } from "@lucide/vue";

const testimonials = [
  {
    text: "CourseLab полностью изменил подход к онбордингу в нашей компании.",
    name: "Игорь С.",
    role: "CTO, TechFlow",
  },
  {
    text:
      "Интуитивный конструктор курсов. Мы сэкономили 60% времени на создание материалов.",
    name: "Марина Л.",
    role: "Head of L&D, FinanceGroup",
  },
  {
    text: "Аналитика прогресса сотрудников позволяет принимать точные решения.",
    name: "Алексей Р.",
    role: "HR Director, RetailMax",
  },
];
</script>

<template>
  <section class="surface-card rounded-[2rem] border border-white/70 p-6 lg:p-10">
    <h2 class="text-2xl font-bold text-slate-900 mb-8 text-center">
      Что говорят клиенты
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="t in testimonials"
        :key="t.name"
        class="p-6 rounded-2xl bg-white/50 border border-slate-100 hover:border-blue-100 transition-colors"
      >
        <Quote class="h-6 w-6 text-blue-200 mb-3" />
        <p class="text-sm text-slate-700 mb-4 leading-relaxed">"{{ t.text }}"</p>
        <div class="flex items-center gap-1 mb-3">
          <Star
            v-for="s in 5"
            :key="s"
            class="h-3.5 w-3.5 fill-amber-400 text-amber-400"
          />
        </div>
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-full bg-slate-200" />
          <div>
            <div class="text-sm font-semibold text-slate-900">{{ t.name }}</div>
            <div class="text-xs text-slate-500">{{ t.role }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
