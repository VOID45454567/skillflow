<!-- components/course/create/LessonCardEditor.vue -->
<template>
  <div
    class="glass rounded-xl p-4 transition-all duration-300 cursor-pointer"
    :class="{
      'border-l-4 border-l-primary shadow-lg scale-[1.02]': isSelected,
      'hover:shadow-md hover:scale-[1.01]': !isSelected,
    }"
    @click="$emit('select', lesson)"
  >
    <div class="flex items-start gap-3">
      <!-- Status Icon -->
      <div
        class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
        :class="isSelected ? 'bg-linear-to-br from-primary/20 to-accent/20' : 'bg-gray-100'"
      >
        <Edit v-if="isSelected" class="h-5 w-5 text-primary" />
        <BookOpen v-else class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span
            class="text-xs font-medium px-2 py-0.5 rounded-full"
            :class="isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'"
          >
            Урок {{ index + 1 }}
          </span>
          <span v-if="lesson.goals?.length" class="text-xs text-gray-400 flex items-center gap-1">
            <Target class="h-3 w-3" />
            {{ lesson.goals.length }}
          </span>
        </div>

        <h4 class="font-medium mb-1" :class="isSelected ? 'text-primary' : 'text-gray-800'">
          {{ lesson.title || 'Без названия' }}
        </h4>

        <div class="flex items-center gap-3 text-xs text-gray-500">
          <div v-if="lesson.requredTime" class="flex items-center gap-1">
            <Clock class="h-3 w-3" />
            <span>{{ lesson.requredTime }} мин</span>
          </div>
          <div v-if="lesson.content?.sections?.length" class="flex items-center gap-1">
            <Layers class="h-3 w-3" />
            <span>{{ getContentSummary(lesson.content.sections) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          @click.stop="$emit('edit', index)"
          class="p-2 rounded-lg hover:bg-primary/10 transition-colors"
          title="Редактировать урок"
        >
          <Edit class="h-4 w-4 text-gray-400 hover:text-primary" />
        </button>
        <button
          @click.stop="$emit('remove', index)"
          class="p-2 rounded-lg hover:bg-rose-50 transition-colors"
          title="Удалить урок"
        >
          <Trash2 class="h-4 w-4 text-gray-400 hover:text-rose-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, BookOpen, Target, Clock, Layers, Trash2 } from '@lucide/vue'
import type { Lesson, LessonContent } from '@/types/course/Lesson'

interface LessonWithTemp extends Partial<Omit<Lesson, 'content'>> {
  tempId?: number
  content: LessonContent
}

defineProps<{
  lesson: LessonWithTemp
  index: number
  isSelected: boolean
}>()

defineEmits<{
  select: [lesson: LessonWithTemp]
  edit: [index: number]
  remove: [index: number]
}>()

const getContentSummary = (sections: any[]): string => {
  const types: Record<string, string> = {
    text: 'Т',
    media: 'М',
    code: 'К',
  }
  const summary = sections
    .slice(0, 3)
    .map((s) => types[s.type] || '?')
    .join('')
  return sections.length > 3 ? `${summary}+` : summary
}
</script>
