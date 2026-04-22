<template>
  <Modal :model-value="modelValue" @close="$emit('update:modelValue', false)">
    <div class="space-y-5 text-center">
      <div
        class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3"
      >
        <Shield class="h-6 w-6 text-primary" />
      </div>
      <h3 class="text-lg font-bold text-gray-800">
        {{ enabled ? "Отключение 2FA" : "Включение 2FA" }}
      </h3>
      <p class="text-sm text-gray-500">
        {{
          enabled
            ? "Вы уверены, что хотите отключить двухфакторную аутентификацию? Это снизит безопасность вашего аккаунта."
            : "Двухфакторная аутентификация обеспечит дополнительную защиту вашего аккаунта."
        }}
      </p>

      <div class="flex gap-3">
        <BaseButton
          variant="outlined"
          class="flex-1"
          @click="$emit('update:modelValue', false)"
        >
          Отмена
        </BaseButton>
        <BaseButton
          class="flex-1"
          :class="enabled ? 'bg-accent-pink hover:bg-accent-pink/80' : ''"
          @click="$emit('confirm')"
        >
          {{ enabled ? "Отключить" : "Включить" }}
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Shield } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";

defineProps<{
  modelValue: boolean;
  enabled: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();
</script>
