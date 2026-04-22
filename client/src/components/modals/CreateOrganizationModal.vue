<!-- components/organization/CreateOrganizationModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="close" width="md">
    <div class="space-y-5">
      <!-- Заголовок -->
      <div class="text-center mb-2">
        <div
          class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4"
        >
          <Building2 class="h-8 w-8 text-primary" />
        </div>
        <h3 class="text-xl font-bold text-gray-800">Создание организации</h3>
        <p class="text-sm text-gray-500 mt-1">Заполните информацию о вашей организации</p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.name"
          label="Название организации"
          placeholder="Например: Академия Программирования"
          :error="errors.name"
          required
        >
          <template #prefix>
            <Building2 class="h-4 w-4 text-gray-400" />
          </template>
        </BaseInput>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-600">Описание</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Расскажите о вашей организации, её целях и задачах..."
            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            :class="{ 'border-rose-500': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="text-xs text-rose-500 mt-1">
            {{ errors.description }}
          </p>
        </div>

        <!-- Информационный блок -->
        <div class="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p class="text-xs text-gray-600 flex items-start gap-2">
            <Info class="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              После создания вы станете владельцем организации и сможете приглашать
              участников, создавать курсы и управлять настройками.
            </span>
          </p>
        </div>

        <!-- Кнопки -->
        <div class="flex gap-3 pt-2">
          <BaseButton variant="outlined" class="flex-1" @click="close" type="button">
            Отмена
          </BaseButton>
          <BaseButton class="flex-1" type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
            <Plus v-else class="h-4 w-4 mr-2" />
            {{ loading ? "Создание..." : "Создать" }}
          </BaseButton>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Building2, Info, Plus, Loader2 } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";
import { useToast } from "@/composables/useToast";
import { useOrganizationStore } from "@/stores/organization";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  created: [];
}>();

const orgStore = useOrganizationStore();
const toast = useToast();

const loading = ref(false);
const form = ref({
  name: "",
  description: "",
});

const errors = ref({
  name: "",
  description: "",
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
  form.value = {
    name: "",
    description: "",
  };
  errors.value = {
    name: "",
    description: "",
  };
};

const validate = (): boolean => {
  errors.value = {
    name: "",
    description: "",
  };

  let isValid = true;

  if (!form.value.name.trim()) {
    errors.value.name = "Название обязательно";
    isValid = false;
  } else if (form.value.name.length < 3) {
    errors.value.name = "Минимум 3 символа";
    isValid = false;
  }

  if (form.value.description.length > 500) {
    errors.value.description = "Максимум 500 символов";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  try {
    await orgStore.create(form.value.name, form.value.description);
    emit("created");
    close();
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Ошибка при создании организации");
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit("update:modelValue", false);
};
</script>
