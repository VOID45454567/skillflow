<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  BookOpen,
  Building2,
  BarChart3,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  ChevronRight,
} from '@lucide/vue'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import type { Component } from 'vue'
import router from '@/router'
import { UserRoles } from '@/types/enums/roles'

interface NavItem {
  label: string
  pathName: string
  icon: Component
}

const uiStore = useUIStore()
const authStore = useAuthStore()
const { success, error } = useToast()

const user = computed(() => authStore.currentUser)
const isUserMenuOpen = ref<boolean>(false)
const isMobileUserMenuOpen = ref<boolean>(false)
const mobileMenuOpen = ref<boolean>(false)

const userMenuRef = ref<HTMLElement | null>(null)

const navItems: NavItem[] = [
  { label: 'Организации', pathName: 'organizations', icon: Building2 },
  { label: 'Курсы', pathName: 'public-courses', icon: BookOpen },
  { label: 'Аналитика', pathName: 'analytics', icon: BarChart3 },
]

const toggleUserMenu = (): void => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = (): void => {
  isUserMenuOpen.value = false
}

const toggleMobileMenu = (): void => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (!mobileMenuOpen.value) {
    isMobileUserMenuOpen.value = false
  }
}

const toggleMobileUserMenu = (): void => {
  isMobileUserMenuOpen.value = !isMobileUserMenuOpen.value
}

const handleLogout = async (): Promise<void> => {
  closeUserMenu()
  isMobileUserMenuOpen.value = false
  mobileMenuOpen.value = false

  const confirmed = window.confirm('Вы уверены, что хотите выйти из аккаунта?')

  if (confirmed) {
    try {
      await authStore.logout()
      success('Вы успешно вышли из аккаунта')
      router.push({ name: 'login' })
    } catch (err) {
      error('Ошибка при выходе из аккаунта')
    }
  }
}

const navigateTo = (pathName: string): void => {
  router.push({ name: pathName })
  mobileMenuOpen.value = false
  isMobileUserMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent): void => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky pt-2 top-0 z-50 animate-fadeInUp w-full max-w-350 mx-auto px-2 md:px-4">
    <div class="glass border-b border-white/30 rounded-xl">
      <div class="mx-auto px-3 sm:px-4 lg:px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Логотип -->
          <div
            class="flex items-center gap-2 md:gap-3 cursor-pointer shrink-0"
            @click="router.push({ name: 'home' })"
          >
            <div
              class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center animate-pulseGlow"
            >
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            <span
              class="text-lg md:text-xl font-semibold tracking-tight bg-linear-to-r from-primary to-accent-pink bg-clip-text text-primary"
            >
              Траектория
            </span>
          </div>

          <!-- Десктопная навигация (показывается от 900px) -->
          <nav class="hidden nav-desktop items-center gap-4 lg:gap-8">
            <a
              v-for="item in navItems"
              :key="item.pathName"
              @click="navigateTo(item.pathName)"
              class="nav-link text-sm text-gray-600 hover:text-primary font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.label }}
            </a>
          </nav>

          <!-- Десктопное меню пользователя (показывается от 900px) -->
          <div class="hidden nav-desktop items-center gap-3 lg:gap-4">
            <template v-if="authStore.isAuthenticated">
              <div ref="userMenuRef" class="relative">
                <button
                  @click.stop="toggleUserMenu"
                  class="flex items-center gap-2 p-1 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="user?.avatarUrl"
                      :src="user.avatarUrl"
                      :alt="user.login"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="border-2 border-primary rounded-2xl p-1">
                      <User class="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <span class="text-sm font-medium text-gray-700 hidden lg:inline">
                    {{ user?.login }}
                  </span>
                  <ChevronDown
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': isUserMenuOpen }"
                  />
                </button>

                <Transition name="dropdown">
                  <div
                    v-if="isUserMenuOpen"
                    class="absolute right-0 mt-2 w-56 glass-strong rounded-xl shadow-lg py-2 border border-white/30"
                  >
                    <div class="px-4 py-3 border-b border-gray-200/60">
                      <p class="text-sm font-medium text-gray-800">
                        {{ user?.login }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ user?.email }}
                      </p>
                    </div>

                    <router-link
                      to="/profile"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                      @click="closeUserMenu"
                    >
                      <User class="w-4 h-4" />
                      Профиль
                    </router-link>

                    <router-link
                      :to="{ name: 'my-courses' }"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                      @click="closeUserMenu"
                    >
                      <BookOpen class="w-4 h-4" />
                      Мои курсы
                    </router-link>

                    <router-link
                      v-if="user?.role === UserRoles.ADMIN.toString()"
                      :to="{ name: 'admin-dashboard' }"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-accent/10 hover:text-accent transition-colors"
                      @click="closeUserMenu"
                    >
                      <Shield class="w-4 h-4" />
                      Админ-панель
                    </router-link>

                    <div class="border-t border-gray-200/60 my-2"></div>

                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut class="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </Transition>
              </div>
            </template>

            <template v-else>
              <router-link
                :to="{ name: 'login' }"
                class="text-sm text-gray-600 hover:text-primary font-medium transition-colors"
              >
                Войти
              </router-link>
              <router-link
                :to="{ name: 'register' }"
                class="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium"
              >
                Регистрация
              </router-link>
            </template>
          </div>

          <!-- Мобильная кнопка меню (показывается до 900px) -->
          <div class="flex nav-mobile items-center gap-2">
            <template v-if="authStore.isAuthenticated">
              <button
                @click="toggleMobileUserMenu"
                class="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <User class="w-5 h-5 text-gray-600" />
              </button>
            </template>
            <button
              @click="toggleMobileMenu"
              class="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <X v-if="mobileMenuOpen" class="w-5 h-5 text-gray-600" />
              <Menu v-else class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Мобильное меню (показывается до 900px) -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="nav-mobile border-t border-gray-200/60">
          <div class="px-4 py-3 space-y-1">
            <!-- Навигационные ссылки -->
            <a
              v-for="item in navItems"
              :key="item.pathName"
              @click="navigateTo(item.pathName)"
              class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
            >
              <span class="flex items-center gap-3">
                <component :is="item.icon" class="w-5 h-5" />
                <span class="text-sm font-medium">{{ item.label }}</span>
              </span>
              <ChevronRight class="w-4 h-4" />
            </a>

            <!-- Разделитель -->
            <div class="border-t border-gray-200/60 my-2"></div>

            <!-- Мобильное меню пользователя -->
            <template v-if="authStore.isAuthenticated">
              <div class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="user?.avatarUrl"
                      :src="user.avatarUrl"
                      :alt="user.login"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="border-2 border-primary rounded-2xl p-2">
                      <User class="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ user?.login }}</p>
                    <p class="text-xs text-gray-500">{{ user?.email }}</p>
                  </div>
                </div>
              </div>

              <router-link
                to="/profile"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
                @click="mobileMenuOpen = false"
              >
                <User class="w-5 h-5" />
                <span class="text-sm font-medium">Профиль</span>
              </router-link>

              <router-link
                :to="{ name: 'my-courses' }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
                @click="mobileMenuOpen = false"
              >
                <BookOpen class="w-5 h-5" />
                <span class="text-sm font-medium">Мои курсы</span>
              </router-link>

              <router-link
                v-if="user?.role === UserRoles.ADMIN.toString()"
                :to="{ name: 'admin-dashboard' }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-accent hover:bg-accent/5 hover:text-accent transition-colors"
                @click="mobileMenuOpen = false"
              >
                <Shield class="w-5 h-5" />
                <span class="text-sm font-medium">Админ-панель</span>
              </router-link>

              <div class="border-t border-gray-200/60 my-2"></div>

              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut class="w-5 h-5" />
                <span class="text-sm font-medium">Выйти</span>
              </button>
            </template>

            <template v-else>
              <router-link
                :to="{ name: 'login' }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
                @click="mobileMenuOpen = false"
              >
                <LogIn class="w-5 h-5" />
                <span class="text-sm font-medium">Войти</span>
              </router-link>

              <router-link
                :to="{ name: 'register' }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors mt-2"
                @click="mobileMenuOpen = false"
              >
                <UserPlus class="w-5 h-5" />
                <span class="text-sm font-medium">Регистрация</span>
              </router-link>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
/* Основные стили */
.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent-pink));
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Анимации */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to {
  opacity: 1;
  max-height: 600px;
  transform: translateY(0);
}

.slide-down-leave-from {
  opacity: 1;
  max-height: 600px;
  transform: translateY(0);
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

.animate-pulseGlow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(var(--color-primary-rgb), 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.6);
  }
}

/* КАСТОМНЫЙ БРЕЙКПОИНТ 900px */
@media (min-width: 900px) {
  .nav-desktop {
    display: flex !important;
  }

  .nav-mobile {
    display: none !important;
  }
}

@media (max-width: 899px) {
  .nav-desktop {
    display: none !important;
  }

  .nav-mobile {
    display: flex !important;
  }

  .nav-link::after {
    display: none;
  }
}

/* Для очень маленьких экранов */
@media (max-width: 350px) {
  .nav-mobile {
    gap: 0.25rem;
  }
}
</style>
