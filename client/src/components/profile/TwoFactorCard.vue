<template>
  <div class="glass-strong rounded-2xl p-5 card-hover">
    <div class="flex items-center gap-3 mb-3">
      <div
        class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
      >
        <Shield class="h-5 w-5 text-primary" />
      </div>
      <span class="text-sm font-medium text-gray-500">2FA</span>
    </div>
    <div class="text-lg font-bold text-gray-800">
      {{ enabled ? "Включено" : "Отключено" }}
    </div>
    <BaseButton size="sm" variant="tonal" class="mt-3 w-full" @click="$emit('toggle')">
      {{ enabled ? "Выключить" : "Включить" }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { Shield } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";

defineProps<{
  enabled: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>
