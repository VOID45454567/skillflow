<template>
  <Modal :model-value="modelValue" @close="$emit('update:modelValue', false)">
    <div class="space-y-5">
      <div class="text-center mb-4">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-3"
        >
          <Wallet class="h-6 w-6 text-emerald-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-800">Пополнение баланса</h3>
        <p class="text-sm text-gray-500">Текущий баланс: {{ currentBalance }} 💎</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-600">Способ оплаты</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            @click="selectedMethod = method.value"
            class="p-3 rounded-xl border transition-all flex items-center justify-center gap-2"
            :class="
              selectedMethod === method.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
          >
            <component :is="method.icon" class="h-4 w-4" />
            {{ method.label }}
          </button>
        </div>
      </div>

      <BaseInput
        v-model="amount"
        type="number"
        label="Сумма пополнения"
        placeholder="1000"
        @keydown.enter="handleSubmit"
      >
        <template #suffix>
          <span class="text-gray-400">💎</span>
        </template>
      </BaseInput>

      <div class="p-3 bg-primary/5 rounded-xl border border-primary/10">
        <p class="text-xs text-gray-500 text-center">
          1 💎 = 1 ₽. Пополнение происходит моментально.
        </p>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="outlined" class="flex-1" @click="close"> Отмена </BaseButton>
        <BaseButton
          class="flex-1"
          @click="handleSubmit"
          :disabled="!amount || Number(amount) <= 0"
        >
          Пополнить
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Wallet, CreditCard, Smartphone } from "@lucide/vue";
import { PaymentMethod } from "@/types/enums/common-info";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";

const props = defineProps<{
  modelValue: boolean;
  currentBalance: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [amount: number, method: PaymentMethod];
}>();

const amount = ref("");
const selectedMethod = ref<PaymentMethod>(PaymentMethod.CARD);

const paymentMethods = [
  { value: PaymentMethod.CARD, label: "Банковская карта", icon: CreditCard },
  { value: PaymentMethod.SBP, label: "СБП", icon: Smartphone },
];

const handleSubmit = () => {
  const numAmount = Number(amount.value);
  if (numAmount > 0) {
    emit("confirm", numAmount, selectedMethod.value);
  }
};

const close = () => {
  emit("update:modelValue", false);
  amount.value = "";
  selectedMethod.value = PaymentMethod.CARD;
};
</script>
