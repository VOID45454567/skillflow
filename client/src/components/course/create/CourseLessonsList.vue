<template>
  <div
    class="glass-strong rounded-3xl p-6 lg:p-8 animate-fadeInUp"
    style="animation-delay: 0.3s"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl bg-linear-to-br from-accent to-accent-pink flex items-center justify-center"
        >
          <Layers class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">Уроки курса</h2>
          <p class="text-sm text-gray-500">
            {{ lessons.length }} уроков · {{ totalDuration }} мин
          </p>
        </div>
      </div>

      <BaseButton @click="emit('add')" size="sm">
        <Plus class="w-4 h-4 mr-1" />
        Добавить урок
      </BaseButton>
    </div>

    <!-- Lessons List -->
    <div v-if="lessons.length > 0" class="space-y-3">
      <LessonCard
        v-for="(lesson, index) in lessons"
        :key="lesson.tempId || index"
        :lesson="lesson"
        :index="index"
        :is-selected="selectedLessonIndex === index"
        @edit="emit('edit', index)"
        @remove="emit('remove', index)"
        @select="emit('select', index)"
      />
    </div>

    <!-- Empty Lessons -->
    <div v-else class="text-center py-12">
      <Layers class="h-12 w-12 mx-auto text-gray-300 mb-3" />
      <p class="text-gray-500 mb-4">У вас пока нет уроков</p>
      <BaseButton @click="emit('add')" variant="tonal" size="sm">
        <Plus class="w-4 h-4 mr-1" />
        Добавить первый урок
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Layers, Plus } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import LessonCard from "../LessonCard.vue";
import type { Lesson, LessonContent } from "@/types/course/Lesson";

interface LessonWithTemp extends Partial<Lesson> {
  tempId?: number;
  content: LessonContent;
}

defineProps<{
  lessons: LessonWithTemp[];
  totalDuration: number;
  selectedLessonIndex: number;
}>();

const emit = defineEmits<{
  add: [];
  edit: [index: number];
  remove: [index: number];
  select: [index: number];
}>();
</script>
