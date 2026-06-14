<!-- components/organization/dashboard/InviteMemberModal.vue -->
<template>
  <Modal :model-value="modelValue" @close="close" width="lg">
    <div class="space-y-5">
      <!-- Заголовок -->
      <div class="text-center mb-2">
        <div
          class="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3"
        >
          <UserPlus class="h-7 w-7 text-primary" />
        </div>
        <h3 class="text-lg font-bold text-gray-800">Пригласить участника</h3>
        <p class="text-sm text-gray-500 mt-1">
          Найдите пользователя по логину и отправьте приглашение
        </p>
      </div>

      <!-- Поиск -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Введите логин пользователя..."
          class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <!-- Состояние загрузки -->
      <div v-if="loading" class="text-center py-8">
        <Loader2 class="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
        <p class="text-gray-500">Загрузка пользователей...</p>
      </div>

      <!-- Результаты поиска (выпадающий список) -->
      <div
        v-else-if="filteredUsers.length && searchQuery.length >= 2"
        class="max-h-80 overflow-y-auto space-y-2"
      >
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex items-center justify-between p-4 bg-white/40 rounded-xl hover:bg-white/60 transition-colors"
        >
          <div class="flex items-center gap-3">
            <img
              :src="user.avatarUrl || '/placeholder-avatar.png'"
              class="h-12 w-12 rounded-full object-cover"
              :alt="user.login"
            />
            <div>
              <span class="font-medium text-gray-800">{{ user.login }}</span>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
          <AppButton
            :disabled="invitingUserId === user.id"
            @click="inviteUser(user)"
            variant="filled"
          >
            <Loader2 v-if="invitingUserId === user.id" class="h-4 w-4 mr-2 animate-spin" />
            <Mail v-else class="h-4 w-4 mr-2" />
            {{ invitingUserId === user.id ? 'Отправка...' : 'Пригласить' }}
          </AppButton>
        </div>
      </div>

      <!-- Нет результатов -->
      <div
        v-else-if="searchQuery.length >= 2 && !filteredUsers.length && !loading"
        class="text-center py-8"
      >
        <Search class="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <p class="text-gray-500">Пользователи не найдены</p>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="searchQuery.length < 2 && !loading" class="text-center py-8">
        <Search class="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">Введите минимум 2 символа для поиска</p>
      </div>

      <!-- Информация о коде приглашения -->
      <div class="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
        <div class="flex items-start gap-3">
          <Info class="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium text-gray-800 mb-1">Как работает приглашение?</p>
            <p class="text-xs text-gray-600">
              После отправки приглашения, пользователь получит уведомление с кодом для вступления в
              организацию. Код также будет доступен в его профиле.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Search, UserPlus, Mail, Info, Loader2 } from '@lucide/vue'
import Modal from '@/components/common/Modal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useOrganizationStore } from '@/stores/organization'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/user'

const props = defineProps<{
  modelValue: boolean
  organizationId: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  invited: []
}>()

const orgStore = useOrganizationStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const toast = useToast()

const searchQuery = ref('')
const invitingUserId = ref<number | null>(null)
const loading = ref(false)

// Загружаем пользователей при монтировании
onMounted(async () => {
  await loadUsers()
})

// Загружаем пользователей при открытии модалки (на случай если данные устарели)
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      await loadUsers()
    } else {
      resetForm()
    }
  },
)

const loadUsers = async () => {
  // Загружаем только если пользователи еще не загружены
  if (!userStore.users || userStore.users.length === 0) {
    loading.value = true
    try {
      const result = await userStore.getAll()
      // Если API возвращает массив, сохраняем его
      if (Array.isArray(result)) {
        userStore.users = result
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error)
      toast.error('Не удалось загрузить список пользователей')
    } finally {
      loading.value = false
    }
  }
}

const filteredUsers = computed(() => {
  if (!userStore.users || !Array.isArray(userStore.users) || searchQuery.value.length < 2) {
    return []
  }

  const query = searchQuery.value.toLowerCase()

  return userStore.users
    .filter((user: User) => {
      // Исключаем текущего пользователя
      if (user.id === authStore.currentUser?.id) {
        return false
      }

      // Фильтруем по логину (или email, если нужно)
      return user.login.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    })
    .slice(0, 10) // Ограничиваем результаты
})

const resetForm = () => {
  searchQuery.value = ''
  invitingUserId.value = null
}

const inviteUser = async (user: User) => {
  invitingUserId.value = user.id
  try {
    await orgStore.sendInviteCode(user.id, props.organizationId)
    toast.success(`Приглашение отправлено пользователю ${user.login}`)
    emit('invited')
    close()
  } catch (error: any) {
    if (error?.response?.status === 409) {
      toast.error('Пользователь уже состоит в организации или уже приглашен')
    } else {
      toast.error('Не удалось отправить приглашение')
    }
  } finally {
    invitingUserId.value = null
  }
}

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
