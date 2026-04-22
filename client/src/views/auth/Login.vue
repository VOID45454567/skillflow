<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getValidationError } from "@/utils/getValidationError";
import BaseInput from "@/components/ui/AppInput.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { LogIn, Mail, Lock } from "@lucide/vue";
import { useToast } from "@/composables/useToast";

const authStore = useAuthStore();
const { success, error: showError } = useToast();
const state = computed(() => authStore.loginState);
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login({
      email: state.value.email,
      password: state.value.password,
    });
  } catch (err) {
    showError("Произошла ошибка при входе");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
    <div class="glass-strong w-full max-w-md rounded-3xl p-8 shadow-xl animate-scaleIn">
      <div class="flex items-center justify-center mb-6">
        <div
          class="h-14 w-14 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 animate-float"
        >
          <LogIn class="h-7 w-7 text-primary" />
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 text-center mb-1">Вход в систему</h2>
      <p class="text-sm text-gray-500 text-center mb-6">Введите учетные данные</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <BaseInput
          v-model="state.email"
          type="email"
          label="Email"
          placeholder="name@company.com"
          :icon="Mail"
        />
        <p
          v-if="getValidationError('email', state.validationErorrs)"
          class="text-xs text-accent-pink ml-1 animate-fadeIn"
        >
          {{ getValidationError("email", state.validationErorrs) }}
        </p>

        <BaseInput
          v-model="state.password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          :icon="Lock"
        />
        <p
          v-if="getValidationError('password', state.validationErorrs)"
          class="text-xs text-accent-pink ml-1 animate-fadeIn"
        >
          {{ getValidationError("password", state.validationErorrs) }}
        </p>

        <div
          v-if="state.credencialsError"
          class="p-3 rounded-xl bg-accent-pink/10 border border-accent-pink/20 text-sm text-accent-pink text-center animate-fadeIn"
        >
          {{ state.credencialsError }}
        </div>

        <BaseButton type="submit" :loading="loading" class="w-full mt-2">
          <LogIn class="h-4 w-4 mr-2" />
          Войти
        </BaseButton>
      </form>

      <router-link
        to="/register"
        class="block text-center text-sm text-primary hover:text-primary-dark font-medium mt-6 transition-colors"
      >
        Нет аккаунта? Зарегистрироваться
      </router-link>
    </div>
  </div>
</template>
