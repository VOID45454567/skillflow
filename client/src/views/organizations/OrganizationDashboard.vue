<!-- views/OrganizationDetailPage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-4 md:py-8 px-3 md:px-4">
    <!-- Декоративные элементы -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute top-20 right-20 w-48 md:w-72 h-48 md:h-72 bg-linear-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="flex items-center justify-center py-16 md:py-20">
      <div
        class="w-10 h-10 md:w-12 md:h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
      ></div>
    </div>

    <!-- Не найдена -->
    <div v-else-if="!organization" class="text-center py-16 md:py-20">
      <div class="glass-strong rounded-2xl md:rounded-3xl p-8 md:p-12 max-w-md mx-auto">
        <Building2 class="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-2">Организация не найдена</h2>
        <p class="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
          Возможно, она была удалена или не существует
        </p>
        <BaseButton @click="goBack" size="md">Вернуться к списку</BaseButton>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto">
      <!-- Хедер -->
      <div class="mb-6 md:mb-8 animate-fadeInUp">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 md:gap-2 text-gray-500 hover:text-primary transition-colors mb-3 md:mb-4"
        >
          <ArrowLeft class="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span class="text-xs md:text-sm">Назад к организациям</span>
        </button>

        <div class="glass-strong rounded-2xl md:rounded-3xl p-4 md:p-8">
          <div class="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <!-- Логотип -->
            <div
              class="h-24 w-24 md:h-32 md:w-32 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 overflow-hidden border-4 border-white/50 shadow-lg"
            >
              <img
                v-if="organization.logo"
                :src="organization.logo"
                :alt="organization.name"
                class="w-full h-full object-cover"
              />
              <Building2 v-else class="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </div>

            <!-- Информация -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div class="min-w-0">
                  <h1 class="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2 break-words">
                    {{ organization.name }}
                  </h1>
                  <p class="text-sm md:text-base text-gray-600 max-w-2xl">
                    {{ organization.description || 'Описание отсутствует' }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2 shrink-0">
                  <BaseButton
                    v-if="isOwner"
                    @click="goToDashboard"
                    class="shadow-primary/20 text-xs md:text-sm"
                    size="md"
                  >
                    <LayoutDashboard class="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    Управление
                  </BaseButton>
                  <BaseButton
                    v-else-if="!isMember && authStore.isAuthenticated"
                    variant="outlined"
                    size="md"
                    class="text-xs md:text-sm"
                    @click="joinOrganization"
                  >
                    <UserPlus class="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    Вступить
                  </BaseButton>
                  <BaseButton
                    v-else-if="isMember && !isOwner"
                    variant="ghost"
                    size="md"
                    class="text-rose-500 hover:bg-rose-50 text-xs md:text-sm"
                    @click="leaveOrganization"
                  >
                    <LogOut class="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    Покинуть
                  </BaseButton>
                </div>
              </div>

              <!-- Мета-информация -->
              <div class="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-6">
                <div class="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500">
                  <Users class="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>{{ organization.organizationMembers?.length || 0 }} участников</span>
                </div>
                <div class="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500">
                  <BookOpen class="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>{{ organization.courses?.length || 0 }} курсов</span>
                </div>
                <div class="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500">
                  <Calendar class="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Создана {{ formatDate(organization.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500">
                  <Crown class="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
                  <span>Владелец: {{ organization.owner?.login }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Контент -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Левая колонка -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <!-- Курсы организации -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2 md:gap-3">
                <BookOpen class="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <h2 class="text-base md:text-lg font-bold text-gray-800">Курсы организации</h2>
              </div>
              <span class="text-xs md:text-sm text-gray-500">
                {{ organization.courses?.length || 0 }}
                {{ pluralize(organization.courses?.length || 0, 'курс', 'курса', 'курсов') }}
              </span>
            </div>

            <div v-if="!organization.courses?.length" class="text-center py-6 md:py-8">
              <BookOpen class="h-10 w-10 md:h-12 md:w-12 text-gray-300 mx-auto mb-2 md:mb-3" />
              <p class="text-sm md:text-base text-gray-500">Пока нет курсов</p>
              <p v-if="isOwner" class="text-xs md:text-sm text-gray-400 mt-1">
                Создайте первый курс для вашей организации
              </p>
            </div>

            <div v-else class="space-y-2 md:space-y-3">
              <div
                v-for="course in organization.courses"
                :key="course.id"
                class="p-3 md:p-4 bg-white/40 rounded-lg md:rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
                @click="goToCourse(course.id)"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h3 class="font-medium text-gray-800 text-sm md:text-base truncate">
                      {{ course.title }}
                    </h3>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                      {{ course.lessons?.length || 0 }} уроков
                    </p>
                  </div>
                  <ChevronRight class="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          <!-- Галерея -->
          <div
            v-if="organization.images?.length"
            class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp"
          >
            <div class="flex items-center gap-2 md:gap-3 mb-4">
              <Image class="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <h2 class="text-base md:text-lg font-bold text-gray-800">Галерея</h2>
            </div>

            <div class="grid grid-cols-3 gap-2 md:gap-3">
              <div
                v-for="(image, index) in organization.images.slice(0, 6)"
                :key="index"
                class="aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                @click="openGallery(index)"
              >
                <img
                  :src="image"
                  :alt="`Галерея ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка -->
        <div class="space-y-4 md:space-y-6">
          <!-- Участники -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2 md:gap-3">
                <Users class="h-4 w-4 md:h-5 md:w-5 text-accent-cyan" />
                <h2 class="text-base md:text-lg font-bold text-gray-800">Участники</h2>
              </div>
              <span class="text-xs md:text-sm text-gray-500">
                {{ organization.organizationMembers?.length || 0 }}
              </span>
            </div>

            <div v-if="!organization.organizationMembers?.length" class="text-center py-4 md:py-6">
              <Users class="h-8 w-8 md:h-10 md:w-10 text-gray-300 mx-auto mb-2" />
              <p class="text-xs md:text-sm text-gray-500">Нет участников</p>
            </div>

            <div v-else class="space-y-1.5 md:space-y-2 max-h-64 md:max-h-80 overflow-y-auto">
              <div
                v-for="member in organization.organizationMembers.slice(0, 10)"
                :key="member.userId"
                class="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-white/40 rounded-lg md:rounded-xl"
              >
                <img
                  :src="member.user.avatarUrl || '/placeholder-avatar.png'"
                  class="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                  :alt="member.user.login"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5 md:gap-2">
                    <span class="font-medium text-gray-800 truncate text-sm md:text-base">
                      {{ member.user.login }}
                    </span>
                    <Crown
                      v-if="member.userId === organization.userId"
                      class="h-3 w-3 md:h-3.5 md:w-3.5 text-amber-500 shrink-0"
                    />
                  </div>
                  <p class="text-xs text-gray-500">
                    Присоединился {{ formatDate(member.joinedAt) }}
                  </p>
                </div>
              </div>
            </div>

            <button
              v-if="organization.organizationMembers?.length > 10"
              class="w-full mt-2 md:mt-3 text-xs md:text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Показать всех участников
            </button>
          </div>

          <!-- Информация -->
          <div class="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 animate-fadeInUp">
            <div class="flex items-center gap-2 md:gap-3 mb-4">
              <Info class="h-4 w-4 md:h-5 md:w-5 text-accent-pink" />
              <h2 class="text-base md:text-lg font-bold text-gray-800">Информация</h2>
            </div>

            <div class="space-y-2 md:space-y-3">
              <div
                class="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200/40"
              >
                <span class="text-xs md:text-sm text-gray-500">ID организации</span>
                <span class="text-xs md:text-sm font-mono text-gray-700">{{
                  organization.id
                }}</span>
              </div>
              <div
                class="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200/40"
              >
                <span class="text-xs md:text-sm text-gray-500">Код приглашения</span>
                <div class="flex items-center gap-1.5 md:gap-2">
                  <span class="text-xs md:text-sm font-mono text-gray-700">{{
                    organization.inviteCode
                  }}</span>
                  <button
                    @click="copyInviteCode"
                    class="p-1 rounded hover:bg-primary/10 transition-colors"
                  >
                    <Copy class="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div
                class="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200/40"
              >
                <span class="text-xs md:text-sm text-gray-500">Владелец</span>
                <span class="text-xs md:text-sm text-gray-700">{{
                  organization.owner?.login
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <JoinByCodeModal
    v-model="joinModalOpen"
    :organization-id="orgId"
    :owner-email="organization?.owner?.email"
    @joined="handleJoined"
    :invite-code="organization?.inviteCode"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Building2,
  ArrowLeft,
  LayoutDashboard,
  UserPlus,
  LogOut,
  Users,
  BookOpen,
  Calendar,
  Crown,
  ChevronRight,
  Image,
  Info,
  Copy,
} from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import BaseButton from '@/components/ui/AppButton.vue'
import { useOrganizationStore } from '@/stores/organization'
import { formatDate } from '@/utils/formatters/formatDate'
import JoinByCodeModal from '@/components/modals/JoinByCodeModal.vue'

const route = useRoute()
const router = useRouter()
const orgStore = useOrganizationStore()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const joinModalOpen = ref(false)

const organization = computed(() => orgStore.currentOrg!)
const orgId = computed(() => Number(route.params.id))

onMounted(async () => {
  const org = await orgStore.getOrgById(orgId.value)
  orgStore.setCurrentOrg(org)
  console.log(organization.value)
  loading.value = false
})

const isOwner = computed(() => {
  return organization.value?.userId === authStore.currentUser?.id
})

const isMember = computed(() => {
  return organization.value?.organizationMembers?.some(
    (m: any) => m.userId === authStore.currentUser?.id,
  )
})

const goBack = () => {
  router.push({ name: 'organizations' })
}

const goToDashboard = () => {
  router.push({ name: 'organization-dashboard', params: { id: orgId.value } })
}

const goToCourse = (courseId: number) => {
  router.push({ name: 'single-course-page', params: { id: courseId } })
}

const joinOrganization = async () => {
  if (!authStore.currentUser) {
    router.push({ name: 'login' })
    return
  }
  joinModalOpen.value = true
}

const handleJoined = async () => {
  joinModalOpen.value = false
}

const leaveOrganization = async () => {
  await orgStore.removeMember(organization.value.id, authStore.currentUser!.id)
  orgStore.setCurrentOrg({
    ...organization.value,
    organizationMembers: organization.value.organizationMembers.filter(
      (member) => member.userId !== authStore.currentUser!.id,
    ),
  })
}

const copyInviteCode = () => {
  navigator.clipboard.writeText(organization.value?.inviteCode || '')
  toast.success('Код приглашения скопирован')
}

const pluralize = (count: number, one: string, two: string, five: string): string => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return two
  return five
}

const openGallery = (index: number) => {
  // Логика открытия галереи
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out both;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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

/* Адаптивные стили */
@media (max-width: 640px) {
  .glass-strong {
    backdrop-filter: blur(10px);
  }
}
</style>
