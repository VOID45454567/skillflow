<!-- components/organization/JoinByCodeModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="close" width="sm">
    <div class="space-y-5">
      <!-- Заголовок -->
      <div class="text-center">
        <div
          class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3"
        >
          <Key class="h-7 w-7 text-primary" />
        </div>
        <h3 class="text-lg font-bold text-gray-800">Вступление в организацию</h3>
        <p class="text-sm text-gray-500 mt-1">Введите код приглашения</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-600">Код приглашения</label>
          <input
            v-model="inputCode"
            type="text"
            placeholder="Например: 1234567890"
            maxlength="10"
            class="w-full px-4 py-3 text-center text-2xl font-mono tracking-wider rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            :class="{
              'border-rose-500 focus:border-rose-500 focus:ring-rose-200': codeError,
            }"
            @input="handleCodeInput"
          />
          <p v-if="codeError" class="text-xs text-rose-500 mt-1">{{ codeError }}</p>
        </div>

        <!-- Информация о получении кода -->
        <div class="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
          <div class="flex items-start gap-3">
            <Info class="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-800 mb-1">
                Как получить код приглашения?
              </p>
              <p class="text-xs text-gray-600">
                Свяжитесь с владельцем организации для получения кода приглашения.
              </p>
              <div class="mt-3 p-3 bg-white/50 rounded-lg">
                <p class="text-xs text-gray-500 mb-1">Контакт владельца:</p>
                <div class="flex items-center gap-2">
                  <Mail class="h-4 w-4 text-primary" />
                  <span class="text-sm font-medium text-gray-800">{{ ownerEmail }}</span>
                  <button
                    @click="copyEmail"
                    type="button"
                    class="ml-auto p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Копировать email"
                  >
                    <Copy class="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3 pt-2">
          <BaseButton variant="outlined" class="flex-1" @click="close" type="button">
            Отмена
          </BaseButton>
          <BaseButton
            class="flex-1"
            type="submit"
            :disabled="joining || inputCode.length !== 10"
          >
            <Loader2 v-if="joining" class="h-4 w-4 mr-2 animate-spin" />
            <LogIn v-else class="h-4 w-4 mr-2" />
            {{ joining ? "Вступление..." : "Вступить" }}
          </BaseButton>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Key, Info, Mail, Copy, LogIn, Loader2 } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { useToast } from "@/composables/useToast";
import { API } from "@/api";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{
  modelValue: boolean;
  organizationId: number;
  ownerEmail: string;
  inviteCode: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  joined: [];
}>();

const toast = useToast();
const authStore = useAuthStore();
const inputCode = ref("");
const joining = ref(false);
const codeError = ref("");

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
    }
  }
);

const resetForm = () => {
  inputCode.value = "";
  codeError.value = "";
  joining.value = false;
};

const handleCodeInput = () => {
  inputCode.value = inputCode.value.replace(/\D/g, "");
  if (codeError.value) {
    codeError.value = "";
  }
};

const copyEmail = () => {
  navigator.clipboard.writeText(props.ownerEmail);
  toast.success("Email скопирован");
};

const handleSubmit = async () => {
  // Проверяем длину кода
  if (inputCode.value.length !== 10) {
    codeError.value = "Код должен содержать 10 цифр";
    return;
  }

  // Проверяем соответствие кода
  if (inputCode.value !== props.inviteCode) {
    codeError.value = "Неверный код приглашения";
    toast.error("Неверный код приглашения");
    return;
  }

  joining.value = true;
  codeError.value = "";

  try {
    await API.organization.addMember(props.organizationId, authStore.currentUser!.id);
    toast.success("Вы успешно вступили в организацию!");
    emit("joined");
    close();
  } catch (error: any) {
    console.error("Join error:", error);

    if (error?.response?.status === 400) {
      codeError.value = "Неверный код приглашения";
      toast.error("Неверный код приглашения");
    } else if (error?.response?.status === 409) {
      codeError.value = "Вы уже состоите в этой организации";
      toast.error("Вы уже состоите в этой организации");
    } else {
      toast.error("Не удалось вступить в организацию");
    }
  } finally {
    joining.value = false;
  }
};

const close = () => {
  emit("update:modelValue", false);
};
</script>
