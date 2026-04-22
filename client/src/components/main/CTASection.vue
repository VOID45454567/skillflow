<template>
  <section class="animate-fadeInUp" style="animation-delay: 1s">
    <div class="glass-strong rounded-3xl p-8 lg:p-12 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-accent-pink/20 to-rose-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
      ></div>

      <div class="relative text-center max-w-2xl mx-auto">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
        >
          <Zap class="w-4 h-4" />
          Начните бесплатно
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Готовы начать обучение?</h2>
        <p class="text-gray-500 mb-8">
          Присоединяйтесь к тысячам студентов и организаций, которые уже используют
          CourseFlow
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="$emit('register')"
            class="btn-primary px-8 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <UserPlus class="w-5 h-5" />
            Регистрация
          </button>
          <button
            @click="$emit('login')"
            class="glass px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-hover transition-all"
          >
            <LogIn class="w-5 h-5 text-primary" />
            Войти
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Zap, UserPlus, LogIn } from "@lucide/vue";

defineEmits<{
  register: [];
  login: [];
}>();
</script>
