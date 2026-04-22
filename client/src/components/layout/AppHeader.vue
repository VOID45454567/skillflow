<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
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
} from "@lucide/vue";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";
import { useModal } from "@/composables/useModal";
import { useToast } from "@/composables/useToast";
import type { Component } from "vue";
import router from "@/router";
import { UserRoles } from "@/types/enums/roles";

interface NavItem {
  label: string;
  pathName: string;
  icon: Component;
}

const uiStore = useUIStore();
const authStore = useAuthStore();
const { success, error } = useToast();

const user = computed(() => authStore.currentUser);
const isUserMenuOpen = ref<boolean>(false);
const isMobileUserMenuOpen = ref<boolean>(false);

const userMenuRef = ref<HTMLElement | null>(null);

const navItems: NavItem[] = [
  { label: "Организации", pathName: "organizations", icon: Building2 },
  { label: "Курсы", pathName: "public-courses", icon: BookOpen },
  { label: "Аналитика", pathName: "analytics", icon: BarChart3 },
];

const toggleUserMenu = (): void => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = (): void => {
  isUserMenuOpen.value = false;
};

const toggleMobileUserMenu = (): void => {
  isMobileUserMenuOpen.value = !isMobileUserMenuOpen.value;
};

const handleLogout = async (): Promise<void> => {
  closeUserMenu();

  const confirmed = window.confirm("Вы уверены, что хотите выйти из аккаунта?");

  if (confirmed) {
    try {
      await authStore.logout();
      success("Вы успешно вышли из аккаунта");
      router.push({ name: "login" });
    } catch (err) {
      error("Ошибка при выходе из аккаунта");
    }
  }
};

const handleClickOutside = (event: MouseEvent): void => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header class="sticky pt-2 top-0 z-50 animate-fadeInUp w-10/12 mx-auto">
    <div class="glass border-b border-white/30 rounded-xl">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div
            class="flex items-center gap-3 cursor-pointer"
            @click="router.push({ name: 'home' })"
          >
            <div
              class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center animate-pulseGlow"
            >
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            <span
              class="text-xl font-semibold tracking-tight bg-linear-to-r from-primary to-accent-pink bg-clip-text text-primary"
            >
              CourseFlow
            </span>
          </div>

          <nav class="hidden md:flex items-center gap-8">
            <a
              v-for="item in navItems"
              :key="item.pathName"
              @click="router.push({ name: item.pathName })"
              class="nav-link text-sm text-gray-600 hover:text-primary font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.label }}
            </a>
          </nav>

          <div class="hidden md:flex items-center gap-4">
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
                  <span class="text-sm font-medium text-gray-700">
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

          <div class="md:hidden flex items-center gap-2">
            <template v-if="authStore.isAuthenticated">
              <button
                @click="toggleMobileUserMenu"
                class="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <User class="w-5 h-5 text-gray-600" />
              </button>
            </template>
            <button
              @click="uiStore.toggleMobileMenu"
              class="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <X v-if="uiStore.mobileMenuOpen" class="w-5 h-5 text-gray-600" />
              <Menu v-else class="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <Transition name="slide">
        <div v-if="uiStore.mobileMenuOpen" class="md:hidden border-t border-white/30">
          <div class="px-4 py-3 space-y-2">
            <a
              v-for="item in navItems"
              :key="item.pathName"
              @click="
                router.push({ name: item.pathName });
                uiStore.closeMobileMenu();
              "
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ item.label }}
            </a>

            <div
              v-if="!authStore.isAuthenticated"
              class="pt-2 space-y-2 border-t border-gray-200/60"
            >
              <router-link
                to="/login"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                @click="uiStore.closeMobileMenu"
              >
                <LogIn class="w-4 h-4" />
                Войти
              </router-link>
              <router-link
                to="/register"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white bg-primary hover:bg-primary-dark transition-colors"
                @click="uiStore.closeMobileMenu"
              >
                <UserPlus class="w-4 h-4" />
                Регистрация
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>
