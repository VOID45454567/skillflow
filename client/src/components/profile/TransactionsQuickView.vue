<template>
  <div class="glass-strong rounded-2xl p-5">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <History class="h-5 w-5 text-primary" />
        <h3 class="font-semibold text-gray-800">Последние транзакции</h3>
      </div>
      <button
        v-if="transactions?.length"
        @click="$emit('view-all')"
        class="text-sm text-primary hover:text-primary-dark transition-colors"
      >
        Все транзакции →
      </button>
    </div>

    <div v-if="transactions?.length" class="space-y-2">
      <TransactionItem v-for="tx in recentTransactions" :key="tx.id" :transaction="tx" />
    </div>
    <div v-else class="text-center py-6 text-gray-500">
      <History class="h-10 w-10 mx-auto mb-2 text-gray-300" />
      <p class="text-sm">Нет транзакций</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { History } from "@lucide/vue";
import TransactionItem from "./TransactionItem.vue";
import type { Transaction } from "@/types/transaction";

const props = defineProps<{
  transactions: Transaction[];
}>();

defineEmits<{
  "view-all": [];
}>();

const recentTransactions = computed(() => {
  return [...props.transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
});
</script>
