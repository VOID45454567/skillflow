<template>
  <div v-if="courses.length" class="mb-6">
    <h4 class="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
      <Award class="h-4 w-4" />
      Созданные курсы
    </h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="course in courses"
        :key="course.id"
        class="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group"
      >
        <div class="flex items-center justify-between">
          <div>
            <span class="font-medium text-gray-800">{{ course.title }}</span>
            <p class="text-xs text-gray-500 mt-1">
              {{ course.lessons?.length || 0 }} уроков
            </p>
          </div>
          <router-link
            :to="{ name: 'single-course-page', params: { id: course.id } }"
            class="text-primary hover:text-primary-dark"
          >
            →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from "@/types/course";
import { Award } from "@lucide/vue";

defineProps<{
  courses: Course[];
}>();
</script>
