<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getValidationError } from "@/utils/getValidationError";
import BaseInput from "@/components/ui/AppInput.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { UserPlus, Mail, User, Lock } from "@lucide/vue";
import { useToast } from "@/composables/useToast";

const authStore = useAuthStore();
const { error: showError } = useToast();
const state = computed(() => authStore.registerState);
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    await authStore.register({
      email: state.value.email,
      login: state.value.login,
      password: state.value.password,
    });
  } catch (err) {
    showError("Произошла ошибка при регистрации");
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
          class="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center shadow-lg shadow-accent/20 animate-float"
        >
          <UserPlus class="h-7 w-7 text-blue-600" />
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-800 text-center mb-1">Создание аккаунта</h2>
      <p class="text-sm text-gray-500 text-center mb-6">
        Заполните данные для регистрации в системе
      </p>

      <form @submit.prevent="handleRegister" class="space-y-4">
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
          v-model="state.login"
          label="Логин"
          placeholder="ivan_petrov"
          :icon="User"
        />
        <p
          v-if="getValidationError('login', state.validationErorrs)"
          class="text-xs text-accent-pink ml-1 animate-fadeIn"
        >
          {{ getValidationError("login", state.validationErorrs) }}
        </p>

        <BaseInput
          v-model="state.password"
          type="password"
          label="Пароль"
          placeholder="Минимум 8 символов"
          :icon="Lock"
        />
        <p
          v-if="getValidationError('password', state.validationErorrs)"
          class="text-xs text-accent-pink ml-1 animate-fadeIn"
        >
          {{ getValidationError("password", state.validationErorrs) }}
        </p>

        <BaseButton type="submit" :loading="loading" class="w-full mt-2">
          <UserPlus class="h-4 w-4 mr-2" />
          Зарегистрироваться
        </BaseButton>
      </form>

      <router-link
        to="/login"
        class="block text-center text-sm text-primary hover:text-primary-dark font-medium mt-6 transition-colors"
      >
        Уже есть аккаунт? Войти
      </router-link>
    </div>
  </div>
</template>
