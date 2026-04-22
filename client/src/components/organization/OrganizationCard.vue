<!-- components/organization/OrganizationCard.vue -->
<template>
  <div
    class="glass-strong rounded-2xl p-5 card-hover cursor-pointer group"
    @click="$emit('click')"
  >
    <!-- Логотип и название -->
    <div class="flex items-start gap-4 mb-4">
      <div
        class="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white/50 group-hover:border-primary/30 transition-all"
      >
        <img
          v-if="organization.logo"
          :src="organization.logo"
          :alt="organization.name"
          class="w-full h-full object-cover"
        />
        <Building2 v-else class="h-8 w-8 text-primary" />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-gray-800 truncate text-lg">
          {{ organization.name }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">
          {{ organization.description || "Нет описания" }}
        </p>
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="text-center p-2 rounded-lg bg-white/30">
        <Users class="h-4 w-4 text-primary mx-auto mb-1" />
        <span class="text-sm font-semibold text-gray-700">
          {{ organization.organizationMembers?.length || 0 }}
        </span>
        <p class="text-xs text-gray-500">участников</p>
      </div>
      <div class="text-center p-2 rounded-lg bg-white/30">
        <BookOpen class="h-4 w-4 text-accent mx-auto mb-1" />
        <span class="text-sm font-semibold text-gray-700">
          {{ organization.courses?.length || 0 }}
        </span>
        <p class="text-xs text-gray-500">курсов</p>
      </div>
      <div class="text-center p-2 rounded-lg bg-white/30">
        <Crown class="h-4 w-4 text-amber-500 mx-auto mb-1" />
        <span class="text-sm font-semibold text-gray-700 truncate">
          {{ organization.owner?.login || "—" }}
        </span>
        <p class="text-xs text-gray-500">владелец</p>
      </div>
    </div>

    <!-- Нижняя часть -->
    <div class="flex items-center justify-between pt-3 border-t border-gray-200/40">
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <Calendar class="h-3.5 w-3.5" />
        {{ formatDate(organization.createdAt) }}
      </div>
      <div
        class="flex items-center gap-1 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform"
      >
        Подробнее
        <ArrowRight class="h-4 w-4" />
      </div>
    </div>

    <!-- Бейдж владельца -->
    <div
      v-if="isOwner"
      class="absolute -top-2 -right-2 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full shadow-lg"
    >
      Владелец: {{ user.login }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Building2, Users, BookOpen, Crown, Calendar, ArrowRight } from "@lucide/vue";
import type { Organization } from "@/types/Organization";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/formatters/formatDate";

const props = defineProps<{
  organization: Organization;
  user: User;
}>();

defineEmits<{
  click: [];
}>();
console.log(props.organization);

const isOwner = computed(() => {
  return props.organization.userId === props.user.id;
});
</script>
