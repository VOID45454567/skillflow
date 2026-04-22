<template>
  <div class="space-y-2">
    <label class="text-sm font-medium text-gray-600">Тип контента</label>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="type in contentTypes"
        :key="type.value"
        @click="emit('update:modelValue', type.value)"
        class="p-3 rounded-xl border transition-all flex flex-col items-center gap-1"
        :class="[
          modelValue === type.value
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-gray-200 text-gray-600 hover:border-gray-300',
          hasContent[type.value] ? 'ring-1 ring-primary/30' : '',
        ]"
      >
        <component :is="type.icon" class="w-5 h-5" />
        <span class="text-xs font-medium">{{ type.label }}</span>
        <span v-if="hasContent[type.value]" class="text-[10px] text-primary">
          добавлено
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Image, Code } from "@lucide/vue";

type ContentType = "text" | "media" | "code";

const props = defineProps<{
  modelValue: ContentType;
  hasContent: Record<ContentType, boolean>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ContentType];
}>();

const contentTypes: Array<{ value: ContentType; label: string; icon: any }> = [
  { value: "text", label: "Текст", icon: FileText },
  { value: "media", label: "Медиа", icon: Image },
  { value: "code", label: "Код", icon: Code },
];
</script>
