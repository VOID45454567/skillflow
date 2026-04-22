<template>
  <div v-if="blocks.length > 0" class="space-y-2">
    <label class="text-sm font-medium text-gray-600"
      >Добавленные блоки ({{ blocks.length }})</label
    >
    <div class="space-y-2 max-h-48 overflow-y-auto">
      <div
        v-for="(block, i) in blocks"
        :key="block.id || i"
        class="flex items-center justify-between p-3 bg-white/40 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <component :is="getBlockIcon(block.type)" class="w-4 h-4 text-primary" />
          <span class="text-sm text-gray-700">{{ getBlockPreview(block) }}</span>
        </div>
        <button @click="$emit('remove', i)" class="text-gray-400 hover:text-accent-pink">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Image, Code, X } from "@lucide/vue";

defineProps<{
  blocks: any[];
}>();

defineEmits<{
  remove: [index: number];
}>();

const getBlockIcon = (type: string) => {
  const icons: Record<string, any> = {
    text: FileText,
    media: Image,
    code: Code,
  };
  return icons[type] || FileText;
};

const getBlockPreview = (block: any) => {
  if (block.type === "text") {
    return block.content?.substring(0, 50) + (block.content?.length > 50 ? "..." : "");
  }
  if (block.type === "media") {
    return block.altText || block.caption || "Изображение";
  }
  if (block.type === "code") {
    return block.description || `Код на ${block.language}`;
  }
  return "Блок";
};
</script>
