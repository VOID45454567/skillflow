<template>
  <div class="flex items-center justify-between p-3 bg-white/40 rounded-xl">
    <div class="flex items-center gap-3">
      <div
        class="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
        :class="colorClass"
      >
        <component :is="icon" class="h-5 w-5" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-medium text-gray-800 truncate">
          {{ transactionTitle }}
        </p>
        <p v-if="transactionSubtitle" class="text-xs text-gray-500 truncate">
          {{ transactionSubtitle }}
        </p>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ formatDate(transaction.createdAt) }}
        </p>
      </div>
    </div>
    <span class="font-semibold shrink-0 ml-3" :class="amountClass">
      {{ amountPrefix }}{{ transaction.price }} 💎
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  ShoppingCart,
  RotateCcw,
  Gift,
  TrendingUp,
  History,
  ArrowDownLeft,
  ArrowUpRight,
} from "@lucide/vue";
import type { Transaction } from "@/types/transaction";
import { formatDate } from "@/utils/formatters/formatDate";
import { TransactionType } from "@/types/enums/common-info";

const props = defineProps<{
  transaction: Transaction;
}>();

const icon = computed(() => {
  const icons: Record<TransactionType, any> = {
    PURCHASE: ShoppingCart,
    REFUND: RotateCcw,
    GIFT: Gift,
  };
  return icons[props.transaction.type] || History;
});

const colorClass = computed(() => {
  const colors: Record<TransactionType, string> = {
    PURCHASE: "text-rose-500 bg-rose-50",
    REFUND: "text-emerald-500 bg-emerald-50",
    GIFT: "text-accent-pink bg-accent-pink/10",
  };
  return colors[props.transaction.type] || "text-gray-500 bg-gray-50";
});

const amountClass = computed(() => {
  const classes: Record<TransactionType, string> = {
    PURCHASE: "text-rose-600",
    REFUND: "text-emerald-600",
    GIFT: "text-accent-pink",
  };
  return classes[props.transaction.type] || "text-gray-600";
});

const amountPrefix = computed(() => {
  const prefixes: Record<TransactionType, string> = {
    PURCHASE: "-",
    REFUND: "+",
    GIFT: "-",
  };
  return prefixes[props.transaction.type] || "";
});

const transactionTitle = computed(() => {
  const titles: Record<TransactionType, string> = {
    PURCHASE: "Покупка курса",
    REFUND: "Возврат курса",
    GIFT: "Подарок курса",
  };
  return titles[props.transaction.type] || "Транзакция";
});

const transactionSubtitle = computed(() => {
  const course = props.transaction.course;
  const giftUser = props.transaction.giftUser;

  if (!course) return null;

  switch (props.transaction.type) {
    case TransactionType.PURCHASE:
      return course.title;
    case TransactionType.REFUND:
      return `Возврат: ${course.title}`;
    case TransactionType.GIFT:
      if (giftUser) {
        return `Курс "${course.title}" для ${giftUser.login}`;
      }
      return `Курс "${course.title}" в подарок`;
    default:
      return course.title;
  }
});
</script>
