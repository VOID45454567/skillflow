<script setup lang="ts">
import { ref, provide } from "vue";
import { X, CheckCircle, AlertCircle, Info } from "@lucide/vue";

export type ToastType = "success" | "error" | "info";
export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

const addToast = (type: ToastType, title: string, message?: string) => {
  const id = ++nextId;
  toasts.value.push({ id, type, title, message });
  setTimeout(() => (toasts.value = toasts.value.filter((t) => t.id !== id)), 4500);
};

const removeToast = (id: number) =>
  (toasts.value = toasts.value.filter((t) => t.id !== id));
provide("addToast", addToast);

const iconMap = { success: CheckCircle, error: AlertCircle, info: Info };
const borderMap = {
  success: "border-l-emerald-500",
  error: "border-l-rose-500",
  info: "border-l-blue-600",
};
const colorMap = {
  success: "text-emerald-500",
  error: "text-rose-500",
  info: "text-blue-600",
};
</script>

<template>
  <div
    class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm"
  >
    <TransitionGroup name="toast-list">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="w-full pointer-events-auto surface-card rounded-2xl shadow-xl shadow-slate-300/30 border-l-4 animate-toast-enter overflow-hidden"
        :class="borderMap[t.type]"
      >
        <div class="flex items-start gap-3 p-4">
          <component
            :is="iconMap[t.type]"
            :class="['h-5 w-5 shrink-0 mt-0.5', colorMap[t.type]]"
            :stroke-width="2"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-900">{{ t.title }}</p>
            <p v-if="t.message" class="text-sm text-slate-500 mt-0.5">{{ t.message }}</p>
          </div>
          <button
            @click="removeToast(t.id)"
            class="p-1.5 rounded-full hover:bg-slate-100 shrink-0 active:scale-90 transition-all"
          >
            <X class="h-4 w-4 text-slate-400" />
          </button>
        </div>
        <div class="h-0.5 bg-slate-100">
          <div
            class="h-full animate-progress-shrink"
            :class="borderMap[t.type].replace('border-l-', 'bg-')"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
