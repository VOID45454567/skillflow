<template>
  <AppModal
    :model-value="modelValue"
    title="Установка цены"
    description="Укажите стоимость курса в 💎"
    width="sm"
    @close="close"
  >
    <div class="space-y-5">
      <!-- Info -->
      <div class="glass rounded-xl p-4 bg-linear-to-br from-primary/5 to-accent/5">
        <div class="flex items-start gap-3">
          <div
            class="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0"
          >
            <Gem class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="font-medium text-gray-800">
              {{
                isFree
                  ? "Курс сейчас бесплатный"
                  : "Текущая цена: " + formatPrice(currentPrice)
              }}
            </p>
            <p class="text-sm text-gray-500 mt-0.5">
              Установите цену, чтобы сделать курс платным
            </p>
          </div>
        </div>
      </div>

      <!-- Price Input -->
      <div>
        <label class="text-sm font-medium text-gray-600 mb-2 block">
          Стоимость курса
        </label>
        <div class="relative">
          <input
            v-model="price"
            type="number"
            min="1"
            max="999999"
            placeholder="Введите цену"
            class="w-full px-4 py-3 pr-16 rounded-xl bg-white/60 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            @keydown.enter="handleConfirm"
          />
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Gem class="h-5 w-5 text-primary" />
            <span class="text-gray-500">💎</span>
          </div>
        </div>
        <p v-if="priceError" class="text-xs text-rose-500 mt-1.5 ml-1">
          {{ priceError }}
        </p>
      </div>

      <!-- Quick Price Buttons -->
      <div>
        <p class="text-xs text-gray-500 mb-2 ml-1">Быстрый выбор</p>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="quickPrice in quickPrices"
            :key="quickPrice"
            @click="price = quickPrice"
            class="py-2 px-3 rounded-xl border transition-all text-sm font-medium"
            :class="
              price === quickPrice
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white/40'
            "
          >
            {{ quickPrice }}
          </button>
        </div>
      </div>

      <!-- Price Examples -->
      <div class="p-3 bg-gray-50/60 rounded-xl">
        <p class="text-xs text-gray-500 mb-2">Рекомендации:</p>
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">Начинающий курс</span>
            <span class="font-medium text-gray-700">500 - 2000 💎</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">Средний курс</span>
            <span class="font-medium text-gray-700">2000 - 5000 💎</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">Продвинутый курс</span>
            <span class="font-medium text-gray-700">5000 - 15000 💎</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <AppButton variant="outlined" class="flex-1" @click="close"> Отмена </AppButton>
        <AppButton
          class="flex-1"
          :disabled="!isValidPrice"
          :loading="isLoading"
          @click="handleConfirm"
        >
          <Check class="h-4 w-4 mr-2" />
          Установить цену
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Gem, Check } from "@lucide/vue";
import AppModal from "@/components/common/Modal.vue";
import AppButton from "@/components/ui/AppButton.vue";

const props = defineProps<{
  modelValue: boolean;
  isFree?: boolean;
  currentPrice?: number | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [price: number];
}>();

const price = ref<number | null>(null);
const isLoading = ref(false);
const priceError = ref<string | null>(null);

const quickPrices = [500, 1000, 2500, 5000, 7500, 10000, 15000, 25000];

const isValidPrice = computed(() => {
  return price.value && price.value > 0 && price.value <= 999999;
});

function validatePrice(): boolean {
  if (!price.value) {
    priceError.value = "Введите цену";
    return false;
  }
  if (price.value <= 0) {
    priceError.value = "Цена должна быть больше 0";
    return false;
  }
  if (price.value > 999999) {
    priceError.value = "Цена не может превышать 999 999 💎";
    return false;
  }
  priceError.value = null;
  return true;
}

function handleConfirm() {
  if (!validatePrice() || !price.value) return;

  emit("confirm", price.value);
}

function close() {
  emit("update:modelValue", false);
  price.value = null;
  priceError.value = null;
}

function formatPrice(price?: number | null): string {
  if (!price) return "0 💎";
  return `${price} 💎`;
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      // Предзаполняем текущей ценой если есть
      price.value = props.currentPrice || null;
      priceError.value = null;
    }
  }
);
</script>
