<script setup lang="ts">
import { Search, Eye, EyeOff, AlertCircle } from "@lucide/vue";
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    type?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    leftIcon?: boolean;
  }>(),
  { type: "text", leftIcon: false }
);

const emit = defineEmits(["update:modelValue", "clear"]);
const showPassword = ref(false);
const isPassword = computed(() => props.type === "password");
const inputType = computed(() =>
  isPassword.value && !showPassword.value ? "password" : "text"
);
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-xs font-semibold text-slate-500 ml-1">{{
      label
    }}</label>
    <div class="relative">
      <Search
        v-if="leftIcon"
        class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
      />
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        class="apple-input rounded-2xl px-4 py-3 text-sm w-full"
        :class="{ 'pl-10': leftIcon, 'pr-10': isPassword }"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="isPassword"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 active:scale-90 transition-all"
      >
        <Eye v-if="!showPassword" class="h-4 w-4 text-slate-400" />
        <EyeOff v-else class="h-4 w-4 text-slate-400" />
      </button>
      <AlertCircle
        v-if="error"
        class="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400 pointer-events-none"
      />
    </div>
    <p v-if="error" class="text-xs text-rose-500 font-medium ml-1">{{ error }}</p>
  </div>
</template>

<style scoped>
.apple-input {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  color: #0f172a;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-input:hover {
  border-color: #cbd5e1;
  background: #fff;
}
.apple-input:focus {
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  outline: none;
}
</style>
