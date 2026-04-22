<template>
  <div
    class="glass rounded-xl p-4 transition-all duration-300 cursor-pointer"
    :class="{
      'border-l-4 border-l-primary shadow-lg scale-[1.02]': isActive,
      'opacity-60': isLocked,
      'hover:shadow-md hover:scale-[1.01]': !isLocked,
    }"
    @click="handleClick"
  >
    <div class="flex items-start gap-3">
      <!-- Status Icon -->
      <div
        class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
        :class="{
          'bg-gradient-to-br from-emerald-500/20 to-teal-500/20': isCompleted,
          'bg-gradient-to-br from-primary/20 to-accent/20': isActive && !isCompleted,
          'bg-gray-100': !isCompleted && !isActive,
        }"
      >
        <CheckCircle v-if="isCompleted" class="h-5 w-5 text-emerald-500" />
        <PlayCircle v-else-if="isActive" class="h-5 w-5 text-primary" />
        <Lock v-else-if="isLocked" class="h-5 w-5 text-gray-400" />
        <BookOpen v-else class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span
            class="text-xs font-medium px-2 py-0.5 rounded-full"
            :class="{
              'bg-primary/10 text-primary': isActive,
              'bg-gray-100 text-gray-500': !isActive,
            }"
          >
            Урок {{ index + 1 }}
          </span>
          <span
            v-if="isCompleted"
            class="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600"
          >
            Пройден
          </span>
          <span
            v-if="isLocked"
            class="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600"
          >
            Заблокирован
          </span>
        </div>

        <h4
          class="font-medium mb-1"
          :class="{
            'text-gray-800': !isLocked,
            'text-gray-400': isLocked,
          }"
        >
          {{ lesson.title }}
        </h4>

        <div class="flex items-center gap-3 text-xs text-gray-500">
          <div v-if="lesson.goals?.length" class="flex items-center gap-1">
            <Target class="h-3 w-3" />
            <span>{{ lesson.goals.length }} целей</span>
          </div>
          <div v-if="lesson.requredTime" class="flex items-center gap-1">
            <Clock class="h-3 w-3" />
            <span>{{ lesson.requredTime }} мин</span>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        v-if="isActive && !isCompleted"
        class="shrink-0 p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
        @click.stop="$emit('complete', lesson.id)"
      >
        <Check class="h-4 w-4" />
      </button>
      <ChevronRight v-else class="h-5 w-5 text-gray-400 shrink-0" />
    </div>

    <!-- Active Indicator -->
    <div
      v-if="isActive"
      class="absolute -left-1 top-1/2 -translate-y-1/2 h-12 w-1 bg-primary rounded-r-full"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircle,
  PlayCircle,
  Lock,
  BookOpen,
  Target,
  Clock,
  Check,
  ChevronRight,
} from "@lucide/vue";

const props = defineProps<{
  lesson: any;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}>();

const emit = defineEmits<{
  select: [lesson: any];
  complete: [lessonId: number];
}>();

function handleClick() {
  if (!props.isLocked) {
    emit("select", props.lesson);
  }
}
</script>
