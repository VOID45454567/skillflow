<script setup lang="ts">
import { ref } from "vue";
import { Plus } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import BaseInput from "@/components/ui/AppInput.vue";
import type { CodeSection } from "@/types/course/Lesson";

const emit = defineEmits<{
  add: [block: CodeSection];
}>();

const block = ref<CodeSection>({
  type: "code",
  id: "",
  language: "javascript",
  code: "",
  description: "",
  executable: true,
  editable: true,
});

const addBlock = () => {
  if (block.value.code) {
    console.log("💾 Adding code block:", block.value);
    emit("add", {
      ...block.value,
      id: `code-${Date.now()}`,
    });
    // Сброс формы
    block.value = {
      type: "code",
      id: "",
      language: "javascript",
      code: "",
      description: "",
      executable: true,
      editable: true,
    };
  }
};
</script>

<template>
  <div class="space-y-3 p-4 bg-white/40 rounded-xl">
    <select
      v-model="block.language"
      class="input-styled w-full px-3 py-2 rounded-xl bg-white/60 border border-gray-200/60 text-sm"
    >
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="python">Python</option>
      <option value="go">Go</option>
      <option value="rust">Rust</option>
    </select>

    <textarea
      v-model="block.code"
      rows="8"
      placeholder="// Введите код..."
      class="input-styled w-full px-4 py-3 rounded-xl bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none focus:border-primary resize-none"
    ></textarea>

    <BaseInput
      v-model="block.description"
      label="Описание кода"
      placeholder="Что делает этот код"
    />

    <div class="flex items-center gap-4">
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          v-model="block.executable"
          class="rounded border-gray-300"
        />
        <span class="text-sm text-gray-600">Можно запустить</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="block.editable" class="rounded border-gray-300" />
        <span class="text-sm text-gray-600">Можно редактировать</span>
      </label>
    </div>

    <BaseButton @click="addBlock" size="sm" class="w-full" :disabled="!block.code">
      <Plus class="w-4 h-4 mr-1" />
      Добавить блок кода
    </BaseButton>
  </div>
</template>
