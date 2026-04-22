<template>
  <div
    class="glass-strong rounded-3xl p-6 lg:p-8 animate-fadeInUp"
    style="animation-delay: 0.2s"
  >
    <div class="flex items-center gap-3 mb-6">
      <div
        class="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center"
      >
        <BookOpen class="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-800">Основная информация</h2>
        <p class="text-sm text-gray-500">Базовые настройки вашего курса</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Title -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Type class="w-4 h-4 text-primary" />
          Название курса
        </label>
        <input
          :value="title"
          @input="emit('update:title', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Например: JavaScript для начинающих"
          class="input-styled w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200/60 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white/80 transition-all"
        />
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
          <AlignLeft class="w-4 h-4 text-accent" />
          Описание
        </label>
        <textarea
          :value="description"
          @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
          rows="4"
          placeholder="Опишите, о чём ваш курс и чему научатся студенты..."
          class="input-styled w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200/60 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:bg-white/80 resize-none transition-all"
        ></textarea>
      </div>

      <!-- Level -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-accent-pink" />
          Уровень сложности
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="lvl in courseLevels"
            :key="lvl.value"
            @click="emit('update:level', lvl.value)"
            class="px-4 py-2 rounded-xl border transition-all text-sm font-medium"
            :class="
              level === lvl.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white/40'
            "
          >
            {{ lvl.label }}
          </button>
        </div>
      </div>

      <!-- Category & Tags -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Layers class="w-4 h-4 text-accent-cyan" />
          Категория и теги
        </label>

        <div
          class="flex flex-wrap items-center gap-3 p-4 bg-white/40 rounded-xl border border-gray-200/60"
        >
          <!-- Selected Category -->
          <div v-if="selectedCategory" class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Категория:</span>
            <span
              class="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg"
            >
              {{ selectedCategory.name }}
            </span>
          </div>

          <!-- Selected Tags -->
          <div v-if="selectedTags.length > 0" class="flex flex-wrap items-center gap-2">
            <span class="text-sm text-gray-500">Теги:</span>
            <span
              v-for="tag in selectedTags"
              :key="tag.id"
              class="px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-lg"
            >
              {{ tag.name }}
            </span>
          </div>

          <button
            @click="emit('open-terms-modal')"
            class="ml-auto px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
          >
            <Settings class="w-4 h-4" />
            {{ selectedCategory ? "Изменить" : "Выбрать" }}
          </button>
        </div>
      </div>

      <!-- Price -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Wallet class="w-4 h-4 text-emerald-500" />
          Цена
        </label>
        <div class="flex items-center gap-3">
          <button
            @click="emit('update:isFree', !isFree)"
            class="relative w-12 h-6 rounded-full transition-colors shrink-0"
            :class="isFree ? 'bg-primary' : 'bg-gray-300'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              :class="isFree ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
          <span class="text-sm text-gray-600">{{
            isFree ? "Бесплатный" : "Платный"
          }}</span>

          <input
            v-if="!isFree"
            :value="price"
            @input="emit('update:price', Number(($event.target as HTMLInputElement).value))"
            type="number"
            placeholder="Цена"
            min="0"
            class="input-styled w-32 px-3 py-2 rounded-xl bg-white/60 border border-gray-200/60 text-gray-700 text-sm focus:outline-none focus:border-primary"
          />
          <span v-if="!isFree" class="text-sm text-gray-500">💎</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpen,
  Type,
  AlignLeft,
  TrendingUp,
  Layers,
  Wallet,
  Settings,
} from "@lucide/vue";
import type { CourseTerm } from "@/types/course/course-term";

defineProps<{
  title: string;
  description: string;
  level: string;
  isFree: boolean;
  price: number;
  selectedCategory: CourseTerm | null;
  selectedTags: CourseTerm[];
}>();

const emit = defineEmits<{
  "update:title": [value: string];
  "update:description": [value: string];
  "update:level": [value: string];
  "update:isFree": [value: boolean];
  "update:price": [value: number];
  "update:selectedCategory": [value: CourseTerm | null];
  "update:selectedTags": [value: CourseTerm[]];
  "open-terms-modal": [];
}>();

const courseLevels = [
  { value: "BEGINNER", label: "Начинающий" },
  { value: "INTERMEDIATE", label: "Средний" },
  { value: "ADVANCED", label: "Продвинутый" },
  { value: "PROFESSIONAL", label: "Профессиональный" },
];
</script>
