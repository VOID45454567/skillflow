<template>
  <Modal :model-value="modelValue" width="lg" @close="$emit('update:modelValue', false)">
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <CreditCard class="h-5 w-5 text-primary" />
        <h3 class="text-lg font-bold text-gray-800">История платежей</h3>
      </div>

      <div v-if="payments?.length" class="space-y-2 max-h-96 overflow-y-auto">
        <div
          v-for="payment in payments"
          :key="payment.id"
          class="flex items-center justify-between p-3 bg-white/40 rounded-xl"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center"
            >
              <CreditCard class="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">Пополнение баланса</p>
              <p class="text-xs text-gray-500">{{ formatDate(payment.createdAt) }}</p>
              <p class="text-xs text-gray-400 mt-1">
                Метод: {{ payment.method === "CARD" ? "Банковская карта" : "СБП" }}
              </p>
            </div>
          </div>
          <span class="font-semibold text-emerald-600"> +{{ payment.count }} 💎 </span>
        </div>
      </div>
      <div v-else class="text-center py-10 text-gray-500">
        <CreditCard class="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Нет платежей</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { CreditCard } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import type { Payment } from "@/types/payment";

defineProps<{
  modelValue: boolean;
  payments: Payment[];
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
