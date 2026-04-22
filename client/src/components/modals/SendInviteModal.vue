<!-- components/organization/dashboard/SendInviteModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="close" width="md">
    <div class="space-y-5">
      <!-- Заголовок -->
      <div class="text-center mb-2">
        <div
          class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-primary/20 flex items-center justify-center mx-auto mb-3"
        >
          <Mail class="h-7 w-7 text-accent-cyan" />
        </div>
        <h3 class="text-lg font-bold text-gray-800">Отправить приглашение</h3>
        <p class="text-sm text-gray-500 mt-1">Пригласите пользователя по email</p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email пользователя"
          placeholder="user@example.com"
          :error="errors.email"
          required
        >
          <template #prefix>
            <AtSign class="h-4 w-4 text-gray-400" />
          </template>
        </BaseInput>

        <!-- Информация о коде -->
        <div class="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p class="text-sm text-gray-700 mb-2">
            <span class="font-medium">Код приглашения:</span>
            <code class="ml-2 px-2 py-1 bg-white rounded font-mono">{{
              inviteCode
            }}</code>
          </p>
          <p class="text-xs text-gray-500">
            Этот код будет отправлен пользователю на email. Он сможет использовать его для
            вступления в организацию.
          </p>
        </div>

        <!-- Предпросмотр письма -->
        <div class="p-4 rounded-xl bg-white/30 border border-gray-200">
          <p class="text-xs font-medium text-gray-500 mb-2">Письмо будет содержать:</p>
          <div class="text-sm text-gray-700 space-y-1">
            <p>👋 Приветствие</p>
            <p>🏢 Информацию об организации</p>
            <p>
              🔑 Код приглашения: <strong>{{ inviteCode }}</strong>
            </p>
            <p>🔗 Ссылку на страницу организации</p>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3 pt-2">
          <BaseButton variant="outlined" class="flex-1" @click="close" type="button">
            Отмена
          </BaseButton>
          <BaseButton class="flex-1" type="submit" :disabled="sending">
            <Loader2 v-if="sending" class="h-4 w-4 mr-2 animate-spin" />
            <Send v-else class="h-4 w-4 mr-2" />
            {{ sending ? "Отправка..." : "Отправить" }}
          </BaseButton>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Mail, AtSign, Send, Loader2 } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import { useOrganizationStore } from "@/stores/organization";

const props = defineProps<{
  modelValue: boolean;
  organizationId: number;
  inviteCode: string;
  ownerEmail: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const orgStore = useOrganizationStore();
const authStore = useAuthStore();
const toast = useToast();

const sending = ref(false);
const form = ref({
  email: "",
});

const errors = ref({
  email: "",
});

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.value = { email: "" };
  errors.value = { email: "" };
};

const validate = (): boolean => {
  errors.value = { email: "" };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email) {
    errors.value.email = "Email обязателен";
    return false;
  }
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = "Некорректный email";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;

  sending.value = true;
  try {
    await orgStore.sendInviteCode(authStore.currentUser!.id, props.organizationId);
    toast.success("Приглашение отправлено");
    close();
  } catch (error) {
    toast.error("Не удалось отправить приглашение");
  } finally {
    sending.value = false;
  }
};

const close = () => {
  emit("update:modelValue", false);
};
</script>
