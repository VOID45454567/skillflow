<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getValidationError } from '@/utils/getValidationError'
import BaseInput from '@/components/ui/AppInput.vue'
import BaseButton from '@/components/ui/AppButton.vue'
import { UserPlus, Mail, User, Lock } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const { error: showError, success: showSuccess } = useToast()
const state = computed(() => authStore.registerState)
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    const success = await authStore.register({
      email: state.value.email,
      login: state.value.login,
      password: state.value.password,
    })

    // Показываем тост только если НЕ успешно
    if (!success) {
      // Проверяем наличие ошибок валидации
      if (state.value.validationErorrs && state.value.validationErorrs.length > 0) {
        showError('Проверьте правильность заполнения полей')
      } else if (state.value.credencialsError) {
        showError(state.value.credencialsError)
      } else {
        showError('Произошла ошибка при регистрации')
      }
    }
    // Если успешно - редирект происходит в сторе, здесь ничего не делаем
  } catch (err) {
    console.error('Ошибка в handleRegister:', err)
    showError('Произошла ошибка при регистрации')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
    <div class="glass-strong w-full max-w-md rounded-3xl p-8 shadow-xl animate-scaleIn">
      <div class="flex items-center justify-center mb-6">
        <div
          class="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-lg shadow-accent/20 animate-float"
        >
          <UserPlus class="h-7 w-7 text-primary" />
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
          class="text-xs text-red-500 ml-1 animate-fadeIn"
        >
          {{ getValidationError('email', state.validationErorrs) }}
        </p>

        <BaseInput v-model="state.login" label="Логин" placeholder="ivan_petrov" :icon="User" />
        <p
          v-if="getValidationError('login', state.validationErorrs)"
          class="text-xs text-red-500 ml-1 animate-fadeIn"
        >
          {{ getValidationError('login', state.validationErorrs) }}
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
          class="text-xs text-red-500 ml-1 animate-fadeIn"
        >
          {{ getValidationError('password', state.validationErorrs) }}
        </p>

        <!-- Общая ошибка -->
        <p
          v-if="state.credencialsError"
          class="text-sm text-red-500 text-center bg-red-50 rounded-lg p-3 animate-fadeIn"
        >
          {{ state.credencialsError }}
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

<style scoped>
.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
