<template>
  <AppModal :model-value="modelValue" title="Покупка курса" width="md" @close="close">
    <div class="space-y-5">
      <!-- Course Info -->
      <div class="glass rounded-xl p-4 bg-linear-to-br from-primary/5 to-accent/5">
        <div class="flex items-start gap-3">
          <div
            class="h-12 w-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0"
          >
            <BookOpen class="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-800">{{ course?.title }}</h4>
            <p class="text-sm text-gray-500 line-clamp-2">{{ course?.description }}</p>
          </div>
        </div>
      </div>

      <!-- Price Info -->
      <div class="glass rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-gray-600">Стоимость курса</span>
          <span class="text-xl font-bold text-primary">{{
            formatPrice(course?.price)
          }}</span>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-gray-200">
          <span class="text-gray-600">Ваш баланс</span>
          <span
            class="font-semibold"
            :class="hasEnoughBalance ? 'text-emerald-600' : 'text-rose-500'"
          >
            {{ formatPrice(currentBalance) }}
          </span>
        </div>
      </div>

      <!-- Insufficient Balance Warning -->
      <div
        v-if="!hasEnoughBalance"
        class="p-4 bg-amber-50 rounded-xl border border-amber-200"
      >
        <div class="flex items-start gap-3">
          <AlertCircle class="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-amber-800">Недостаточно средств</p>
            <p class="text-sm text-amber-600 mt-1">
              Не хватает {{ formatPrice(requiredAmount) }}. Пополните баланс для покупки.
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->

      <!-- Success State -->
      <div
        v-if="purchaseSuccess"
        class="p-4 bg-emerald-50 rounded-xl border border-emerald-200"
      >
        <div class="flex items-start gap-3">
          <CheckCircle class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-emerald-800">Курс успешно приобретен!</p>
            <p class="text-sm text-emerald-600 mt-1">Теперь вы можете начать обучение</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <AppButton variant="outlined" class="flex-1" @click="close"> Отмена </AppButton>

        <AppButton
          v-if="!purchaseSuccess"
          class="flex-1"
          :disabled="isProcessing"
          @click="handlePurchase"
        >
          <Loader v-if="isProcessing" class="h-4 w-4 mr-2 animate-spin" />
          <ShoppingCart v-else class="h-4 w-4 mr-2" />
          {{ "Купить" }}
        </AppButton>

        <AppButton v-else class="flex-1" @click="goToLearning">
          <PlayCircle class="h-4 w-4 mr-2" />
          Начать обучение
        </AppButton>
      </div>

      <!-- Alternative Payment -->
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  BookOpen,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Loader,
  PlayCircle,
} from "@lucide/vue";
import AppModal from "@/components/common/Modal.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useToast } from "@/composables/useToast";
const toast = useToast();
const props = defineProps<{
  modelValue: boolean;
  course: any;
  currentBalance?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [data: { courseId: number; topUpAmount?: number }];
}>();

const router = useRouter();

const selectedTopUpAmount = ref<number | null>(null);
const isProcessing = ref(false);
const purchaseSuccess = ref(false);

const hasEnoughBalance = computed(() => {
  return (props.currentBalance || 0) >= (props.course?.price || 0);
});

const requiredAmount = computed(() => {
  return (props.course?.price || 0) - (props.currentBalance || 0);
});

async function handlePurchase() {
  if (!hasEnoughBalance.value) {
    close();
    toast.error("Недостаточно средств. Пополните баланс в профиле.");
  }

  if (!props.course?.id) return;

  isProcessing.value = true;

  emit("confirm", {
    courseId: props.course.id,
  });

  setTimeout(() => {
    isProcessing.value = false;
  }, 500);
}
function goToLearning() {
  close();
  router.push({ name: "course-learning", params: { id: props.course?.id } });
}

function goToBalance() {
  close();
  router.push({ name: "profile", query: { action: "balance" } });
}

function close() {
  emit("update:modelValue", false);
  selectedTopUpAmount.value = null;
  purchaseSuccess.value = false;
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
</style>
