<template>
  <AppModal :model-value="modelValue" title="Поздравляем!" @close="$emit('close')">
    <div class="text-center space-y-4">
      <div class="relative">
        <div
          class="absolute inset-0 bg-linear-to-r from-primary/20 via-accent/20 to-accent-cyan/20 rounded-full blur-2xl"
        ></div>
        <div
          class="relative h-24 w-24 mx-auto rounded-full bg-linear-to-br from-primary via-accent to-accent-pink flex items-center justify-center animate-float"
        >
          <Trophy class="h-12 w-12 text-white" />
        </div>
      </div>

      <div>
        <h3
          class="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Курс завершен!
        </h3>
        <p class="text-gray-500 mt-2">
          Вы успешно завершили курс <br />
          <span class="font-semibold text-gray-700">{{ courseTitle }}</span>
        </p>
      </div>

      <div class="flex items-center justify-center gap-2">
        <PartyPopper class="h-5 w-5 text-accent-pink" />
        <span class="text-sm text-gray-600">Отличная работа!</span>
        <PartyPopper class="h-5 w-5 text-accent-cyan" />
      </div>

      <div class="pt-4">
        <AppButton block size="lg" @click="$emit('continue')">
          <CheckCircle class="h-5 w-5 mr-2" />
          Продолжить
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { Trophy, PartyPopper, CheckCircle } from "@lucide/vue";
import AppModal from "@/components/common/Modal.vue";
import AppButton from "@/components/ui/AppButton.vue";

defineProps<{
  modelValue: boolean;
  courseTitle: string;
}>();

defineEmits<{
  close: [];
  continue: [];
}>();
</script>
