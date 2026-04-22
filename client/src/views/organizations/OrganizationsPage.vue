<!-- views/OrganizationsPage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <!-- Декоративные блобы -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-blobFloat"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-full blur-3xl animate-blobFloat"
        style="animation-delay: -2s"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto">
      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Организации</h1>
          <p class="text-gray-500">Создавайте и управляйте своими организациями</p>
        </div>
        <BaseButton @click="openCreateModal" class="shadow-primary/20">
          <Building2 class="h-4 w-4 mr-2" />
          Создать организацию
        </BaseButton>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block">
          <div
            class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          ></div>
        </div>
        <p class="text-gray-500 mt-4">Загрузка организаций...</p>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="!allOrgs.length" class="animate-scaleIn">
        <div class="glass-strong rounded-3xl p-12 text-center max-w-2xl mx-auto">
          <div
            class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6"
          >
            <Building2 class="h-12 w-12 text-primary" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Пока нет организаций</h2>
          <p class="text-gray-500 mb-8 max-w-md mx-auto">
            Создайте свою первую организацию, чтобы начать управлять курсами и приглашать
            участников
          </p>
          <BaseButton size="lg" @click="openCreateModal" class="shadow-primary/20">
            <Plus class="h-5 w-5 mr-2" />
            Создать первую организацию
          </BaseButton>

          <!-- Преимущества -->
          <div class="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-gray-200/40">
            <div class="text-center">
              <div
                class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2"
              >
                <Users class="h-5 w-5 text-primary" />
              </div>
              <p class="text-xs text-gray-500">Командная работа</p>
            </div>
            <div class="text-center">
              <div
                class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-2"
              >
                <BookOpen class="h-5 w-5 text-accent" />
              </div>
              <p class="text-xs text-gray-500">Общие курсы</p>
            </div>
            <div class="text-center">
              <div
                class="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center mx-auto mb-2"
              >
                <Shield class="h-5 w-5 text-accent-cyan" />
              </div>
              <p class="text-xs text-gray-500">Безопасность</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Список организаций -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OrganizationCard
          v-for="(org, index) in allOrgs"
          :key="org.id"
          :organization="org"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-fadeInUp"
          @click="goToOrganization(org.id)"
          :user="currentUser"
        />
      </div>
    </div>

    <CreateOrganizationModal
      v-model="createModalOpen"
      @created="handleOrganizationCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Building2, Plus, Users, BookOpen, Shield } from "@lucide/vue";
import { useToast } from "@/composables/useToast";
import BaseButton from "@/components/ui/AppButton.vue";
import OrganizationCard from "@/components/organization/OrganizationCard.vue";
import { useOrganizationStore } from "@/stores/organization";
import CreateOrganizationModal from "@/components/modals/CreateOrganizationModal.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const orgStore = useOrganizationStore();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(true);
const createModalOpen = ref(false);

const allOrgs = computed(() => orgStore.allOrgs!);

onMounted(async () => {
  await orgStore.getAll();
  loading.value = false;
  await authStore.getMe();
});

const currentUser = computed(() => authStore.currentUser!);

const openCreateModal = () => {
  createModalOpen.value = true;
};

const handleOrganizationCreated = async () => {
  toast.success("Организация успешно создана!");
};

const goToOrganization = (id: number) => {
  router.push({ name: "single-org", params: { id } });
};
</script>
