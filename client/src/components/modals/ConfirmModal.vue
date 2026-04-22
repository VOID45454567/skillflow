<!-- components/common/ConfirmModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="handleCancel" width="sm">
    <div class="space-y-5">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
        :class="iconContainerClass"
      >
        <component :is="iconComponent" class="h-6 w-6" :class="iconClass" />
      </div>
      <h3 class="text-lg font-bold text-gray-800 text-center">{{ title }}</h3>
      <p class="text-sm text-gray-500 text-center">{{ message }}</p>

      <div v-if="requireReason" class="space-y-2">
        <label class="text-sm font-medium text-gray-600">Причина</label>
        <textarea
          v-model="reasonText"
          rows="3"
          :placeholder="reasonPlaceholder"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
        ></textarea>
        <p v-if="reasonError" class="text-xs text-rose-500">{{ reasonError }}</p>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="outlined" class="flex-1" @click="handleCancel">
          Отмена
        </BaseButton>
        <BaseButton
          class="flex-1"
          :class="confirmButtonClass"
          :disabled="requireReason && !reasonText.trim()"
          @click="handleConfirmClick"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { AlertTriangle, Info, AlertCircle, CheckCircle } from "@lucide/vue";
import Modal from "../common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";

const props = defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmText?: string;
  type?: "warning" | "info" | "danger" | "success";
  requireReason?: boolean;
  reasonPlaceholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [reason: string];
  close: [];
}>();

const reasonText = ref("");
const reasonError = ref("");

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      reasonText.value = "";
      reasonError.value = "";
    }
  }
);

const iconComponent = computed(() => {
  const icons = {
    warning: AlertTriangle,
    info: Info,
    danger: AlertCircle,
    success: CheckCircle,
  };
  return icons[props.type || "info"] || Info;
});

const iconContainerClass = computed(() => {
  const classes = {
    warning: "bg-amber-500/20",
    info: "bg-primary/20",
    danger: "bg-rose-500/20",
    success: "bg-emerald-500/20",
  };
  return classes[props.type || "info"] || "bg-primary/20";
});

const iconClass = computed(() => {
  const classes = {
    warning: "text-amber-500",
    info: "text-primary",
    danger: "text-rose-500",
    success: "text-emerald-500",
  };
  return classes[props.type || "info"] || "text-primary";
});

const confirmButtonClass = computed(() => {
  const classes = {
    warning: "bg-amber-500 hover:bg-amber-600",
    info: "bg-primary hover:bg-primary-dark",
    danger: "bg-rose-500 hover:bg-rose-600",
    success: "bg-emerald-500 hover:bg-emerald-600",
  };
  return classes[props.type || "info"] || "bg-primary hover:bg-primary-dark";
});

const handleConfirmClick = () => {
  if (props.requireReason && !reasonText.value.trim()) {
    reasonError.value = "Укажите причину";
    return;
  }

  const reason = reasonText.value;
  emit("confirm", reason);
  emit("update:modelValue", false);
  reasonText.value = "";
  reasonError.value = "";
};

const handleCancel = () => {
  emit("close");
  emit("update:modelValue", false);
  reasonText.value = "";
  reasonError.value = "";
};
</script>
