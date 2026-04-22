<template>
  <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-12">
      <HeroSection />

      <StatsSection />

      <PopularCoursesSection :courses="popularCourses" @view-all="handleViewAllCourses" />

      <CTASection />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HeroSection from "@/components/main/HeroSection.vue";
import StatsSection from "@/components/main/StatsBanner.vue";
import PopularCoursesSection from "@/components/main/PopularCoursesSection.vue";
import CTASection from "@/components/main/CTASection.vue";
import { useToast } from "@/composables/useToast";
import { mockCourses } from "@/mock/courses";

const { success } = useToast();

const isCreateModalOpen = ref<boolean>(false);
const popularCourses = ref(mockCourses);

const handleViewAllCourses = (): void => {
  console.log("Navigate to all courses");
};
</script>
