<template>
  <div>
    <div
      class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 animate-float"
    >
      <Sparkles class="w-8 h-8 text-primary" />
    </div>

    <h3 class="text-2xl font-bold text-center text-gray-800 mb-2">Быстрый старт</h3>
    <p class="text-center text-gray-500 mb-8">Выберите тип курса для создания</p>

    <div class="space-y-3">
      <button
        v-for="option in courseTypeOptions"
        :key="option.value"
        @click="$emit('select', option.value)"
        class="w-full p-4 rounded-xl border border-gray-200/60 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-4 group text-left"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
          :style="{ background: option.gradient }"
        >
          <component :is="option.icon" class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="font-medium text-gray-800">{{ option.title }}</p>
          <p class="text-sm text-gray-500">{{ option.description }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles, Video, FileText, Gamepad2 } from "@lucide/vue";
import type { Component } from "vue";

interface CourseTypeOption {
  value: string;
  title: string;
  description: string;
  icon: Component;
  gradient: string;
}

const courseTypeOptions: CourseTypeOption[] = [
  {
    value: "video",
    title: "Видеокурс",
    description: "Запись видеоуроков и лекций",
    icon: Video,
    gradient: "linear-gradient(135deg, #8b5cf6, #9333ea)",
  },
  {
    value: "text",
    title: "Текстовый курс",
    description: "Статьи и инструкции",
    icon: FileText,
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  },
  {
    value: "interactive",
    title: "Интерактивный",
    description: "Тесты, задания и симуляции",
    icon: Gamepad2,
    gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
  },
];

defineEmits<{
  select: [value: string];
}>();
</script>
