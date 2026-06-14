<template>
  <div id="app" class="w-full overflow-x-hidden">
    <AnimatedBackground />

    <div
      v-if="isInitialLoading"
      class="fixed inset-0 z-100 flex items-center justify-center bg-[#f0f0f7]/90 backdrop-blur-md"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center animate-pulseGlow"
        >
          <Loader2 class="w-6 h-6 text-white animate-spin" />
        </div>
        <p class="text-sm text-gray-500">Загрузка...</p>
      </div>
    </div>

    <div v-else class="relative z-10 min-h-screen flex flex-col">
      <AppHeader />
      <router-view class="flex-1 w-full" />
      <AppFooter />
    </div>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader2 } from '@lucide/vue'
import AnimatedBackground from '@/components/layout/AnimatedBackground.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isInitialLoading = ref<boolean>(true)

onMounted(async () => {
  try {
    const user = await authStore.getMe()

    if (user) {
      authStore.setCurrentUser(user)
    }
  } catch (err) {
    console.error('Failed to initialize app:', err)
  } finally {
    isInitialLoading.value = false
  }
})
</script>

<style>
/* Глобальные стили */
#app {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

/* Убираем scoped, чтобы стили применились глобально */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Сброс для всех контейнеров */
@media (max-width: 840px) {
  .container,
  [class*='max-w-'] {
    max-width: 100% !important;
  }
}
</style>
