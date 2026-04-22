<template>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-800">Профиль пользователя</h1>
    <BaseButton
      variant="ghost"
      class="text-accent-pink hover:text-accent-pink/80 hover:bg-accent-pink/10"
      @click="$emit('logout')"
    >
      <LogOut class="h-4 w-4 mr-2" /> Выйти
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { LogOut } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";

defineEmits<{
  logout: [];
}>();
</script>
