<template>
  <div class="space-y-3 p-4 bg-white/40 rounded-xl">
    <div class="flex gap-2">
      <button
        v-for="format in textFormats"
        :key="format"
        @click="block.format = format"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        :class="
          block.format === format
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        "
      >
        {{ format }}
      </button>
    </div>

    <textarea
      v-model="block.content"
      rows="6"
      :placeholder="placeholder"
      class="input-styled w-full px-4 py-3 rounded-xl bg-white/60 border border-gray-200/60 text-gray-700 focus:outline-none focus:border-primary resize-none font-mono text-sm"
    ></textarea>

    <BaseInput
      v-model="annotationInput"
      placeholder="Добавить аннотацию (например: важно)"
      @keydown.enter.prevent="addAnnotation"
    >
      <template #suffix>
        <button @click="addAnnotation" class="text-primary hover:text-primary-dark">
          <Plus class="w-4 h-4" />
        </button>
      </template>
    </BaseInput>

    <div v-if="block.annotations?.length" class="flex flex-wrap gap-2">
      <span
        v-for="(ann, i) in block.annotations"
        :key="i"
        class="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
      >
        {{ ann }}
        <button @click="block.annotations.splice(i, 1)">
          <X class="w-3 h-3" />
        </button>
      </span>
    </div>

    <BaseButton @click="addBlock" size="sm" class="w-full" :disabled="!block.content">
      <Plus class="w-4 h-4 mr-1" />
      Добавить текстовый блок
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus, X } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";

const emit = defineEmits<{
  add: [block: any];
}>();

const block = ref({
  type: "text",
  format: "html",
  content: "",
  annotations: [] as string[],
});

const annotationInput = ref("");

const textFormats = ["html", "markdown", "plain"];

const placeholder = computed(() => {
  if (block.value.format === "markdown") {
    return "## Заголовок\n\nТекст с **форматированием**...";
  }
  return "Введите текст...";
});

const addAnnotation = () => {
  const trimmed = annotationInput.value.trim();
  if (trimmed && !block.value.annotations.includes(trimmed)) {
    block.value.annotations.push(trimmed);
    annotationInput.value = "";
  }
};

const addBlock = () => {
  if (block.value.content) {
    emit("add", { ...block.value });
    block.value = {
      type: "text",
      format: "html",
      content: "",
      annotations: [],
    };
  }
};
</script>
