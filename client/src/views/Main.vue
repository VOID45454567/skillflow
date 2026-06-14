<template>
  <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-12">
      <HeroSection @create-course="createCourse" />
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
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

const { success } = useToast();

const emits = defineEmits(['create-course'])

const isCreateModalOpen = ref<boolean>(false);
const popularCourses = ref(mockCourses);
const store = useAuthStore()
const handleViewAllCourses = (): void => {
  router.push({ name: 'courses-public' })
};

const createCourse = () => {
  const isAuth = store.isAuthenticated
  if (isAuth) {
    router.push({ name: 'create-course' })
  }
  router.push({ name: 'login' })
}
</script>
