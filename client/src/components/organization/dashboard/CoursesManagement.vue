<!-- components/organization/dashboard/CoursesManagement.vue -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">Курсы организации</h2>
      <BaseButton @click="goToCreate">
        <Plus class="h-4 w-4 mr-2" />
        Создать курс
      </BaseButton>
    </div>

    <div v-if="!courses.length" class="glass-strong rounded-2xl p-12 text-center">
      <BookOpen class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Нет курсов</h3>
      <p class="text-gray-500 mb-6">Создайте первый курс для вашей организации</p>
      <BaseButton @click="goToCreate()">
        <Plus class="h-4 w-4 mr-2" />
        Создать курс
      </BaseButton>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="course in courses"
        :key="course.id"
        class="glass-strong rounded-xl p-5 card-hover group"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-800 truncate">{{ course.title }}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ course.description || "Нет описания" }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <BookOpen class="h-4 w-4" />
            <span>{{ course.lessons?.length || 0 }} уроков</span>
          </div>
          <div class="flex items-center gap-1">
            <Users class="h-4 w-4" />
            <span>{{ course.studentsCount || 0 }} студентов</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-gray-200/40">
          <BaseButton size="sm" variant="ghost" class="flex-1">
            <Edit class="h-4 w-4 mr-1" />
            Редактировать
          </BaseButton>
          <BaseButton
            size="sm"
            variant="ghost"
            class="flex-1 text-rose-500 hover:bg-rose-50"
            @click="deleteCourse(course)"
          >
            <Trash2 class="h-4 w-4 mr-1" />
            Удалить
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Plus, BookOpen, Users, Edit, Trash2 } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { useToast } from "@/composables/useToast";
import { useModal } from "@/composables/useModal";
import router from "@/router";

const props = defineProps<{
  organizationId: number;
  courses: any[];
  isOwner: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const toast = useToast();
const modal = useModal();

const goToCreate = () => {
  router.push({ name: "create-course", query: { orgId: props.organizationId } });
};

const deleteCourse = async (course: any) => {
  const confirmed = await modal.confirm({
    title: "Удаление курса",
    message: `Вы уверены, что хотите удалить курс "${course.title}"? Это действие нельзя отменить.`,
    type: "danger",
    confirmText: "Удалить",
  });

  if (confirmed) {
    try {
      // await coursesStore.delete(course.id);
      toast.success("Курс удален");
      emit("refresh");
    } catch (error) {
      toast.error("Не удалось удалить курс");
    }
  }
};
</script>
