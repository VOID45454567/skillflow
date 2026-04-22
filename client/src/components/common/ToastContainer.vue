<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="glass-strong rounded-xl p-4 shadow-lg flex items-start gap-3"
    >
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="getToastClasses(toast.type)"
      >
        <component :is="getToastIcon(toast.type)" class="w-5 h-5" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-800">{{ toast.message }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ toast.time }}</p>
      </div>
      <button
        @click="removeToast(toast.id)"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "@lucide/vue";
import { useToast } from "@/composables/useToast";
import type { ToastType } from "@/types/common";

const { toasts, removeToast } = useToast();

const getToastClasses = (type: ToastType): string => {
  const classes: Record<ToastType, string> = {
    success: "bg-emerald-100 text-emerald-600",
    error: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
  };
  return classes[type] || classes.info;
};

const getToastIcon = (type: ToastType) => {
  const icons: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };
  return icons[type] || Info;
};
</script>

<style scoped>
.toast-enter-active {
  animation: toastIn 0.4s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.3s ease-out forwards;
}

@keyframes toastIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toastOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
