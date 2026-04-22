<template>
  <div id="app">
    <AnimatedBackground />

    <div
      v-if="isInitialLoading"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-[#f0f0f7]/90 backdrop-blur-md"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulseGlow"
        >
          <Loader2 class="w-6 h-6 text-white animate-spin" />
        </div>
        <p class="text-sm text-gray-500">Загрузка...</p>
      </div>
    </div>

    <div v-else class="relative z-10 min-h-screen flex flex-col">
      <AppHeader />
      <router-view />
      <AppFooter />
    </div>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Loader2 } from "@lucide/vue";
import AnimatedBackground from "@/components/layout/AnimatedBackground.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import ToastContainer from "@/components/common/ToastContainer.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const isInitialLoading = ref<boolean>(true);

onMounted(async () => {
  try {
    const user = await authStore.getMe();

    if (user) {
      authStore.setCurrentUser(user);
    }
  } catch (err) {
    console.error("Failed to initialize app:", err);
  } finally {
    isInitialLoading.value = false;
  }
});
</script>

<style scoped>
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
</style>
