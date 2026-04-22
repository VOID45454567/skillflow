<!-- views/OrganizationDashboardPage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <!-- Декоративные элементы -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-blobFloat"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-accent-pink/20 to-accent-cyan/20 rounded-full blur-3xl animate-blobFloat"
        style="animation-delay: -2s"
      ></div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div
        class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="!organization || !isOwner" class="text-center py-20">
      <div class="glass-strong rounded-3xl p-12 max-w-md mx-auto">
        <Shield class="h-16 w-16 text-rose-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-800 mb-2">Нет доступа</h2>
        <p class="text-gray-500 mb-6">
          Только владелец организации может управлять настройками
        </p>
        <BaseButton @click="goBack">Вернуться назад</BaseButton>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <!-- Хедер -->
      <div class="mb-8 animate-fadeInUp">
        <div class="flex items-center justify-between mb-4">
          <button
            @click="goBack"
            class="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            <span class="text-sm">Назад к организации</span>
          </button>
        </div>

        <div class="glass-strong rounded-3xl p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="h-16 w-16 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden border-2 border-white/50"
              >
                <img
                  v-if="organization.logo"
                  :src="organization.logo"
                  :alt="organization.name"
                  class="w-full h-full object-cover"
                />
                <Building2 v-else class="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-800">
                  {{ organization.name }}
                  <span
                    class="ml-3 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    Дашборд
                  </span>
                </h1>
                <p class="text-gray-500 text-sm mt-1">
                  Управление организацией и её участниками
                </p>
              </div>
            </div>

            <!-- Код приглашения -->
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-xs text-gray-500 mb-1">Код приглашения</p>
                <div class="flex items-center gap-2">
                  <code
                    class="px-3 py-2 bg-white/50 rounded-lg font-mono text-lg font-semibold text-primary"
                  >
                    {{ organization.inviteCode }}
                  </code>
                  <button
                    @click="copyInviteCode"
                    class="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Копировать код"
                  >
                    <Copy class="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Вкладки -->
      <div class="mb-6 animate-fadeInUp">
        <div class="flex gap-2 border-b border-gray-200/40 pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
            :class="
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-gray-500 hover:bg-white/30'
            "
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
            <span
              v-if="tab.count !== undefined"
              class="ml-2 px-2 py-0.5 rounded-full text-xs"
              :class="
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              "
            >
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Контент вкладок -->
      <div class="animate-scaleIn">
        <!-- Курсы -->
        <CoursesManagement
          v-if="activeTab === 'courses'"
          :organization-id="organization.id"
          :courses="organization.courses || []"
          :is-owner="true"
          @refresh="loadOrganization"
        />

        <!-- Участники -->
        <MembersManagement
          v-else-if="activeTab === 'members'"
          :organization-id="organization.id"
          :members="organization.organizationMembers || []"
          :owner-id="organization.userId"
          :invite-code="organization.inviteCode"
          :owner-email="organization.owner?.email"
          @refresh="loadOrganization"
        />

        <!-- Настройки -->
        <SettingsManagement
          v-else-if="activeTab === 'settings'"
          :organization="organization"
          @refresh="loadOrganization"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Building2,
  ArrowLeft,
  Copy,
  BookOpen,
  Users,
  Settings,
  Shield,
} from "@lucide/vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import BaseButton from "@/components/ui/AppButton.vue";
import CoursesManagement from "@/components/organization/dashboard/CoursesManagement.vue";
import MembersManagement from "@/components/organization/dashboard/MembersManagment.vue";
import SettingsManagement from "@/components/organization/dashboard/SettingsManagement.vue";
import { useOrganizationStore } from "@/stores/organization";

const route = useRoute();
const router = useRouter();
const orgStore = useOrganizationStore();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(true);
const organization = computed(() => orgStore.currentOrg!);
const activeTab = ref<"courses" | "members" | "settings">("courses");

const orgId = computed(() => Number(route.params.id));

const isOwner = computed(() => {
  return organization.value?.userId === authStore.currentUser?.id;
});

const tabs = computed(() => [
  {
    id: "courses" as const,
    label: "Курсы",
    icon: BookOpen,
    count: organization.value?.courses?.length || 0,
  },
  {
    id: "members" as const,
    label: "Участники",
    icon: Users,
    count: organization.value?.organizationMembers?.length || 0,
  },
  {
    id: "settings" as const,
    label: "Настройки",
    icon: Settings,
    count: undefined,
  },
]);

onMounted(async () => {
  await loadOrganization();
});

const loadOrganization = async () => {
  loading.value = true;
  try {
    const responce = await orgStore.getOrgById(orgId.value);
    orgStore.setCurrentOrg(responce);
  } catch (error) {
    toast.error("Не удалось загрузить организацию");
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: "organization-detail", params: { id: orgId.value } });
};

const copyInviteCode = () => {
  navigator.clipboard.writeText(organization.value?.inviteCode || "");
  toast.success("Код приглашения скопирован");
};
</script>
