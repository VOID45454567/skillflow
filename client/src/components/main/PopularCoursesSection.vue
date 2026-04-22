<template>
  <section class="animate-fadeInUp" style="animation-delay: 0.6s">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Flame class="w-6 h-6 text-orange-500" />
        Популярные курсы
      </h2>
      <button
        @click="$emit('view-all')"
        class="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1 transition-colors"
      >
        Все курсы
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        v-for="(course, idx) in courses"
        :key="course.id"
        :course="course"
        :delay="0.7 + idx * 0.1"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Flame, ArrowRight } from "@lucide/vue";
import CourseCard from "@/components/ui/CourseCard.vue";
import type { CourseCardData } from "@/types/course";

defineProps<{
  courses: CourseCardData[];
}>();

defineEmits<{
  "view-all": [];
}>();
</script>
