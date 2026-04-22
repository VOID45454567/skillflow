<template>
  <section class="text-center space-y-6 animate-fadeInUp" style="animation-delay: 0.1s">
    <div
      class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-primary font-medium badge-glow"
    >
      <span class="relative flex h-2 w-2">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
      Новая платформа для обучения
    </div>

    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
      <span
        class="bg-gradient-to-r from-primary via-accent to-accent-pink bg-clip-text text-transparent"
      >
        Создавайте курсы
      </span>
      <br />
      <span class="text-gray-700">Проходите обучение</span>
    </h1>

    <p class="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
      Современная платформа для создания, управления и прохождения учебных курсов. Всё
      необходимое для эффективного обучения в одном месте.
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
      <button
        @click="$emit('create-course')"
        class="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
      >
        <PlusCircle class="w-5 h-5" />
        Создать курс
      </button>
      <button
        @click="$emit('start-learning')"
        class="glass px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-hover transition-all hover:-translate-y-0.5"
      >
        <PlayCircle class="w-5 h-5 text-primary" />
        Начать обучение
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PlusCircle, PlayCircle } from "@lucide/vue";
</script>
