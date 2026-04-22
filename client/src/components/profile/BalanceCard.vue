<template>
  <div class="glass-strong rounded-2xl p-5 card-hover">
    <div class="flex items-center gap-3 mb-3">
      <div
        class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"
      >
        <Wallet class="h-5 w-5 text-emerald-600" />
      </div>
      <span class="text-sm font-medium text-gray-500">Баланс</span>
    </div>
    <div class="text-2xl font-bold text-gray-800">{{ balance }} 💎</div>
    <div class="flex gap-2 mt-3">
      <BaseButton size="sm" variant="tonal" class="flex-1" @click="$emit('add')">
        <Plus class="h-4 w-4 mr-1" /> Пополнить
      </BaseButton>
      <BaseButton size="sm" variant="ghost" @click="$emit('history')">
        <History class="h-4 w-4" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wallet, Plus, History } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";

defineProps<{
  balance: number;
}>();

defineEmits<{
  add: [];
  history: [];
}>();
</script>
