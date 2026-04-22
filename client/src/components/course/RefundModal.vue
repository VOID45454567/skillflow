<template>
  <AppModal :model-value="modelValue" title="Возврат курса" width="md" @close="close">
    <div class="space-y-5">
      <!-- Warning Icon -->
      <div class="flex justify-center">
        <div class="relative">
          <div
            class="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"
          ></div>
          <div
            class="relative h-16 w-16 rounded-full bg-linear-to-br from-rose-500 to-accent-pink flex items-center justify-center"
          >
            <RotateCcw class="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="text-center">
        <h3 class="text-lg font-bold text-gray-800">Вы уверены?</h3>
        <p class="text-gray-500 mt-1">
          Вы собираетесь вернуть курс <br />
          <span class="font-semibold text-gray-700">"{{ courseTitle }}"</span>
        </p>
      </div>

      <!-- Refund Info -->
      <div class="glass rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Стоимость курса</span>
          <span class="font-semibold text-gray-800">{{ formatPrice(price) }}</span>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-200">
          <span class="text-gray-600">Сумма возврата</span>
          <span class="text-xl font-bold text-emerald-600">{{
            formatPrice(refundAmount)
          }}</span>
        </div>
      </div>

      <!-- Progress Loss Warning -->
      <div v-if="hasProgress" class="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div class="flex items-start gap-3">
          <AlertCircle class="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-amber-800">Прогресс будет потерян</p>
            <p class="text-sm text-amber-600 mt-1">
              Вы прошли {{ progressPercent }}% курса. При возврате весь прогресс будет
              удален.
            </p>
          </div>
        </div>
      </div>

      <!-- Refund Policy -->
      <div class="p-3 bg-gray-50 rounded-xl">
        <p class="text-xs text-gray-500 text-center">
          Возврат возможен в течение 14 дней с момента покупки.<br />
          Средства вернутся на ваш баланс моментально.
        </p>
      </div>

      <!-- Refund Reason -->
      <div>
        <label class="text-sm font-medium text-gray-600 mb-2 block">
          Причина возврата (необязательно)
        </label>
        <div class="space-y-2">
          <button
            v-for="reason in refundReasons"
            :key="reason"
            @click="selectedReason = reason"
            class="w-full p-3 rounded-xl border transition-all text-left text-sm"
            :class="
              selectedReason === reason
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            "
          >
            {{ reason }}
          </button>
        </div>

        <textarea
          v-if="selectedReason === 'Другое'"
          v-model="customReason"
          placeholder="Укажите причину..."
          rows="3"
          class="w-full mt-3 px-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
        ></textarea>
      </div>

      <!-- Confirmation Checkbox -->
      <label class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
        <input
          v-model="confirmed"
          type="checkbox"
          class="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary/20"
        />
        <span class="text-sm text-gray-600">
          Я понимаю, что при возврате курса я потеряю доступ к материалам, а весь прогресс
          будет удален без возможности восстановления
        </span>
      </label>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <AppButton variant="outlined" class="flex-1" @click="close"> Отмена </AppButton>

        <AppButton
          class="flex-1 bg-rose-500 hover:bg-rose-600"
          :disabled="!confirmed || isProcessing"
          @click="handleRefund"
        >
          <Loader v-if="isProcessing" class="h-4 w-4 mr-2 animate-spin" />
          <RotateCcw v-else class="h-4 w-4 mr-2" />
          Подтвердить возврат
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { RotateCcw, AlertCircle, Loader } from "@lucide/vue";
import AppModal from "@/components/common/Modal.vue";
import AppButton from "@/components/ui/AppButton.vue";

const props = defineProps<{
  modelValue: boolean;
  courseTitle?: string;
  price?: number;
  hasProgress?: boolean;
  progressPercent?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [data: { reason?: string }];
}>();

const selectedReason = ref<string | null>(null);
const customReason = ref("");
const confirmed = ref(false);
const isProcessing = ref(false);

const refundReasons = [
  "Курс не соответствует описанию",
  "Слишком сложный материал",
  "Слишком простой материал",
  "Купил по ошибке",
  "Передумал",
  "Другое",
];

const refundAmount = computed(() => {
  // Можно добавить логику частичного возврата в зависимости от прогресса
  return props.price || 0;
});

async function handleRefund() {
  isProcessing.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const reason =
    selectedReason.value === "Другое" ? customReason.value : selectedReason.value;
  emit("confirm", { reason: reason || undefined });

  isProcessing.value = false;
  close();
}

function close() {
  emit("update:modelValue", false);
  selectedReason.value = null;
  customReason.value = "";
  confirmed.value = false;
  isProcessing.value = false;
}

function formatPrice(price?: number): string {
  if (!price && price !== 0) return "0 💎";
  return `${price} 💎`;
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      close();
    }
  }
);
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
