<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import BaseButton from "@/components/ui/AppButton.vue";
import { Smartphone, ArrowLeft } from "@lucide/vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const code = ref("");
const loading = ref(false);

const verify = async () => {
  if (code.value.length !== 6) return;
  loading.value = true;
  try {
    await authStore.verify2fa(code.value);
  } finally {
    loading.value = false;
  }
};

const resend = async () => {
  try {
    await authStore.sendVerificationCode();
  } catch {}
};
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
    <div
      class="surface-card w-full max-w-md rounded-3xl border border-white/70 p-8 shadow-xl text-center"
    >
      <div
        class="mx-auto h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"
      >
        <Smartphone class="h-6 w-6" />
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-1">Подтверждение 2FA</h2>
      <p class="text-sm text-slate-500 mb-6">
        Введите 6-значный код из приложения или SMS
      </p>

      <input
        v-model="code"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="6"
        autocomplete="one-time-code"
        class="apple-input w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-2xl mb-6"
        placeholder="000000"
        @input="e => code = (e.target as HTMLInputElement).value.replace(/\D/g, '')"
        @keydown.enter="verify"
      />

      <div class="space-y-4">
        <BaseButton
          @click="verify"
          :loading="loading"
          :disabled="code.length !== 6"
          class="w-full"
        >
          Подтвердить
        </BaseButton>

        <div class="flex items-center justify-between pt-2">
          <button
            @click="router.back()"
            class="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft class="h-3.5 w-3.5" /> Назад
          </button>
          <button
            @click="resend"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Отправить код снова
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
