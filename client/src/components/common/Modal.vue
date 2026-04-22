<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-gray-900/30 backdrop-blur-sm"
          @click="handleBackdropClick"
        ></div>

        <!-- Modal Content -->
        <div
          class="relative glass-strong rounded-3xl shadow-2xl animate-scaleIn max-h-[90vh] overflow-hidden flex flex-col"
          :class="[widthClass, contentClass]"
        >
          <button
            v-if="showClose"
            @click="handleClose"
            class="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors z-10"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>

          <div class="overflow-y-auto p-6 lg:p-8">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X } from "@lucide/vue";
import type { ModalSize } from "@/types/common";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    width?: ModalSize;
    showClose?: boolean;
    closeOnBackdrop?: boolean;
    contentClass?: string;
  }>(),
  {
    width: "md",
    showClose: true,
    closeOnBackdrop: true,
    contentClass: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const widthClass = computed(() => {
  const widths: Record<string, string> = {
    sm: "w-sm",
    md: "w-md",
    lg: "w-lg",
    xl: "w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
    "1/2": "w-1/2",
    "10/12": "w-10/12",
  };
  return widths[props.width] || widths.md;
});

const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose();
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
