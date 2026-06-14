<!-- views/OrganizationsPage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-4 md:py-8 px-3 md:px-4">
    <!-- Декоративные блобы -->
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-blobFloat"
      ></div>
      <div
        class="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-56 md:w-96 h-56 md:h-96 bg-gradient-to-br from-accent-pink/20 to-accent-cyan/20 rounded-full blur-3xl animate-blobFloat"
        style="animation-delay: -2s"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto">
      <!-- Заголовок -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 animate-fadeInUp"
      >
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Организации</h1>
          <p class="text-sm md:text-base text-gray-500">
            Создавайте и управляйте своими организациями
          </p>
        </div>
        <BaseButton @click="openCreateModal" class="shadow-primary/20 w-full sm:w-auto" size="md">
          <Building2 class="h-4 w-4 mr-2" />
          Создать организацию
        </BaseButton>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="loading" class="text-center py-16 md:py-20">
        <div class="inline-block relative">
          <div
            class="w-10 h-10 md:w-12 md:h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          ></div>
          <div class="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        </div>
        <p class="text-sm md:text-base text-gray-500 mt-3 md:mt-4">Загрузка организаций...</p>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="!allOrgs.length" class="animate-scaleIn">
        <div
          class="glass-strong rounded-2xl md:rounded-3xl p-6 md:p-12 text-center max-w-2xl mx-auto"
        >
          <div
            class="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 md:mb-6"
          >
            <Building2 class="h-8 w-8 md:h-12 md:w-12 text-primary" />
          </div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
            Пока нет организаций
          </h2>
          <p class="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-md mx-auto">
            Создайте свою первую организацию, чтобы начать управлять курсами и приглашать участников
          </p>
          <BaseButton
            size="lg"
            @click="openCreateModal"
            class="shadow-primary/20 w-full sm:w-auto inline-flex"
          >
            <Plus class="h-5 w-5 mr-2" />
            Создать первую организацию
          </BaseButton>

          <!-- Преимущества -->
          <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-4 mt-8 md:mt-10 pt-6 md:pt-6 border-t border-gray-200/40"
          >
            <div class="text-center flex sm:block items-center gap-3 sm:gap-0">
              <div
                class="w-10 h-10 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mx-auto mb-0 sm:mb-2"
              >
                <Users class="h-5 w-5 md:h-5 md:w-5 text-primary" />
              </div>
              <div class="text-left sm:text-center">
                <p class="text-sm md:text-sm font-medium text-gray-700 mb-0.5">Командная работа</p>
                <p class="text-xs text-gray-400 hidden sm:block">Приглашайте участников</p>
              </div>
            </div>
            <div class="text-center flex sm:block items-center gap-3 sm:gap-0">
              <div
                class="w-10 h-10 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mx-auto mb-0 sm:mb-2"
              >
                <BookOpen class="h-5 w-5 md:h-5 md:w-5 text-accent" />
              </div>
              <div class="text-left sm:text-center">
                <p class="text-sm md:text-sm font-medium text-gray-700 mb-0.5">Общие курсы</p>
                <p class="text-xs text-gray-400 hidden sm:block">Создавайте вместе</p>
              </div>
            </div>
            <div class="text-center flex sm:block items-center gap-3 sm:gap-0">
              <div
                class="w-10 h-10 md:w-10 md:h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0 mx-auto mb-0 sm:mb-2"
              >
                <Shield class="h-5 w-5 md:h-5 md:w-5 text-accent-cyan" />
              </div>
              <div class="text-left sm:text-center">
                <p class="text-sm md:text-sm font-medium text-gray-700 mb-0.5">Безопасность</p>
                <p class="text-xs text-gray-400 hidden sm:block">Контроль доступа</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Список организаций в flex-col -->
      <div v-else class="flex flex-col gap-4 md:gap-6">
        <OrganizationCard
          v-for="(org, index) in allOrgs"
          :key="org.id"
          :organization="org"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-fadeInUp w-full"
          @click="goToOrganization(org.id)"
          :user="currentUser"
        />
      </div>
    </div>

    <CreateOrganizationModal v-model="createModalOpen" @created="handleOrganizationCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Building2, Plus, Users, BookOpen, Shield } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import BaseButton from '@/components/ui/AppButton.vue'
import OrganizationCard from '@/components/organization/OrganizationCard.vue'
import { useOrganizationStore } from '@/stores/organization'
import CreateOrganizationModal from '@/components/modals/CreateOrganizationModal.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const orgStore = useOrganizationStore()
const authStore = useAuthStore()
const toast = useToast()
const loading = ref(true)
const createModalOpen = ref(false)

const allOrgs = computed(() => orgStore.allOrgs!)

onMounted(async () => {
  await orgStore.getAll()
  loading.value = false
  await authStore.getMe()
})

const currentUser = computed(() => authStore.currentUser!)

const openCreateModal = () => {
  createModalOpen.value = true
}

const handleOrganizationCreated = async () => {
  toast.success('Организация успешно создана!')
  await orgStore.getAll()
}

const goToOrganization = (id: number) => {
  router.push({ name: 'single-org', params: { id } })
}
</script>

<style scoped>
.animate-blobFloat {
  animation: blobFloat 8s ease-in-out infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out both;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

@keyframes blobFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Адаптивные стили */
@media (max-width: 640px) {
  .glass-strong {
    backdrop-filter: blur(10px);
  }

  .animate-blobFloat {
    animation-duration: 6s;
  }
}

@media (max-width: 350px) {
  .glass-strong {
    padding: 1rem;
  }
}
</style>
