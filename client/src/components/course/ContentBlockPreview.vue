<template>
  <div class="space-y-4">
    <div
      v-for="section in content?.sections || []"
      :key="section.id"
      class="glass rounded-xl p-5"
    >
      <!-- Text Block -->
      <div v-if="section.type === 'text'" class="space-y-3">
        <div class="flex items-center gap-2 text-primary">
          <FileText class="w-4 h-4" />
          <span class="text-xs font-medium">Текстовый блок</span>
          <span class="text-xs text-gray-400 ml-auto">{{ section.format }}</span>
        </div>
        <div
          v-if="section.format === 'html'"
          v-html="section.content"
          class="prose prose-sm max-w-none"
        ></div>
        <pre v-else class="text-sm text-gray-700 whitespace-pre-wrap font-mono">{{
          section.content
        }}</pre>
        <div v-if="section.annotations?.length" class="flex gap-2">
          <span
            v-for="ann in section.annotations"
            :key="ann"
            class="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full"
          >
            {{ ann }}
          </span>
        </div>
      </div>

      <!-- Media Block -->
      <div v-else-if="section.type === 'media'" class="space-y-3">
        <div class="flex items-center gap-2 text-accent-cyan">
          <Image class="w-4 h-4" />
          <span class="text-xs font-medium">Изображение</span>
        </div>
        <img :src="section.url" :alt="section.altText" class="rounded-xl max-w-full" />
        <p v-if="section.caption" class="text-sm text-gray-500 text-center">
          {{ section.caption }}
        </p>
      </div>

      <!-- Code Block -->
      <div v-else-if="section.type === 'code'" class="space-y-3">
        <div class="flex items-center gap-2 text-primary">
          <Code class="w-4 h-4" />
          <span class="text-xs font-medium">Код · {{ section.language }}</span>
          <div class="ml-auto flex gap-1">
            <span v-if="section.executable" class="text-xs text-emerald-500"
              >▶ запускаемый</span
            >
            <span v-if="section.editable" class="text-xs text-accent-cyan"
              >✎ редактируемый</span
            >
          </div>
        </div>
        <pre
          class="bg-gray-900 rounded-xl p-4 overflow-x-auto"
        ><code class="text-sm text-gray-100 font-mono">{{ section.code }}</code></pre>
        <p v-if="section.description" class="text-sm text-gray-500">
          {{ section.description }}
        </p>

        <!-- Test Cases -->
        <div v-if="section.testCases?.length" class="mt-3 space-y-2">
          <p class="text-xs font-medium text-gray-600">Тесты:</p>
          <div
            v-for="(test, i) in section.testCases"
            :key="i"
            class="text-xs bg-gray-100 rounded-lg p-2"
          >
            <code>{{ test.input }}</code> → <code>{{ test.expected }}</code>
          </div>
        </div>

        <!-- Hints -->
        <div v-if="section.hints?.length" class="mt-3 space-y-1">
          <p class="text-xs font-medium text-gray-600">Подсказки:</p>
          <ul class="list-disc list-inside text-xs text-gray-500">
            <li v-for="(hint, i) in section.hints" :key="i">{{ hint }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="!content?.sections?.length" class="text-center py-8 text-gray-400">
      <FileText class="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p class="text-sm">Нет контента для отображения</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LessonContent } from "@/types/course/Lesson";
import { FileText, Image, Code } from "@lucide/vue";

defineProps<{
  content: LessonContent;
}>();
</script>
