<template>
  <div class="space-y-3 p-4 bg-white/40 rounded-xl">
    <div
      @click="triggerFileUpload"
      class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
      :class="{ 'border-primary bg-primary/5': block.url }"
    >
      <Image class="w-10 h-10 mx-auto text-gray-400 mb-2" />
      <p class="text-sm text-gray-500">
        {{ block.url ? "Изображение выбрано" : "Нажмите для загрузки изображения" }}
      </p>
      <input
        type="file"
        accept="image/*"
        class="hidden"
        ref="fileInput"
        @change="handleFileUpload"
      />
    </div>

    <BaseInput
      v-model="block.altText"
      label="Alt текст"
      placeholder="Описание изображения"
    />

    <BaseInput
      v-model="block.caption"
      label="Подпись к изображению"
      placeholder="Рисунок 1: Пример"
    />

    <BaseButton @click="addBlock" size="sm" class="w-full" :disabled="!block.url">
      <Plus class="w-4 h-4 mr-1" />
      Добавить медиа блок
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Image, Plus } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";

const emit = defineEmits<{
  add: [block: any];
}>();

const block = ref({
  type: "media",
  url: "",
  altText: "",
  caption: "",
});

const fileInput = ref<HTMLInputElement>();

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    block.value.url = URL.createObjectURL(file);
  }
};

const addBlock = () => {
  if (block.value.url) {
    emit("add", { ...block.value });
    block.value = {
      type: "media",
      url: "",
      altText: "",
      caption: "",
    };
  }
};
</script>
