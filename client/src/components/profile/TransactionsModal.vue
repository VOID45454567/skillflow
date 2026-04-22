<template>
  <Modal :model-value="modelValue" width="lg" @close="$emit('update:modelValue', false)">
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center"
        >
          <History class="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800">История транзакций</h3>
          <p class="text-sm text-gray-500">{{ transactions?.length || 0 }} операций</p>
        </div>
      </div>

      <!-- Фильтры -->
      <div v-if="transactions?.length" class="flex gap-2 pb-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="
            activeFilter === filter.value
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          "
        >
          {{ filter.label }}
        </button>
      </div>

      <div
        v-if="filteredTransactions.length"
        class="space-y-2 max-h-96 overflow-y-auto pr-1"
      >
        <TransactionItem
          v-for="tx in filteredTransactions"
          :key="tx.id"
          :transaction="tx"
        />
      </div>
      <div v-else class="text-center py-10 text-gray-500">
        <History class="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>
          {{ activeFilter === "all" ? "Нет транзакций" : "Нет транзакций этого типа" }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { History } from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import TransactionItem from "./TransactionItem.vue";
import type { Transaction } from "@/types/transaction";
import { TransactionType } from "@/types/enums/common-info";

const props = defineProps<{
  modelValue: boolean;
  transactions: Transaction[];
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const activeFilter = ref<string>("all");

const filters = [
  { value: "all", label: "Все" },
  { value: TransactionType.PURCHASE, label: "Покупки" },
  { value: TransactionType.REFUND, label: "Возвраты" },
  { value: TransactionType.GIFT, label: "Подарки" },
];

const filteredTransactions = computed(() => {
  const sorted = [...props.transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (activeFilter.value === "all") {
    return sorted;
  }

  return sorted.filter((tx) => tx.type === activeFilter.value);
});
</script>
