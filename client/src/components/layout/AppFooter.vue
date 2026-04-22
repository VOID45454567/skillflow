<template>
  <footer class="mt-12 glass border-t border-white/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            <span
              class="text-lg font-semibold bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent"
            >
              CourseFlow
            </span>
          </div>
          <p class="text-sm text-gray-500 leading-relaxed">
            Современная платформа для создания и прохождения учебных курсов.
          </p>
        </div>

        <!-- Platform Links -->
        <div v-for="section in footerSections" :key="section.title">
          <h4 class="font-semibold text-gray-700 mb-4">{{ section.title }}</h4>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.label">
              <a
                :href="link.path"
                class="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="font-semibold text-gray-700 mb-4">Подписка</h4>
          <p class="text-sm text-gray-500 mb-3">Получайте обновления о новых курсах</p>
          <div class="flex gap-2">
            <input
              v-model="email"
              type="email"
              placeholder="email@example.com"
              class="flex-1 px-3 py-2 rounded-lg bg-white/60 border border-gray-200/60 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-primary"
            />
            <button
              @click="handleSubscribe"
              class="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1"
            >
              <Send class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div
        class="border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-sm text-gray-400">© 2025 CourseFlow. Все права защищены.</p>
        <div class="flex gap-6">
          <a href="#" class="text-sm text-gray-400 hover:text-primary transition-colors"
            >Политика конфиденциальности</a
          >
          <a href="#" class="text-sm text-gray-400 hover:text-primary transition-colors"
            >Условия использования</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BookOpen, Send } from "@lucide/vue";
import { useToast } from "@/composables/useToast";
import type { Component } from "vue";

interface SocialLink {
  name: string;
  icon: Component;
  url: string;
}

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const { success } = useToast();
const email = ref<string>("");

const footerSections: FooterSection[] = [
  {
    title: "Платформа",
    links: [
      { label: "Курсы", path: "/courses" },
      { label: "Организации", path: "/organizations" },
      { label: "Аналитика", path: "/analytics" },
      { label: "Сертификаты", path: "/certificates" },
    ],
  },
  {
    title: "Поддержка",
    links: [
      { label: "Документация", path: "/docs" },
      { label: "FAQ", path: "/faq" },
      { label: "Контакты", path: "/contacts" },
      { label: "Статус системы", path: "/status" },
    ],
  },
];

const handleSubscribe = (): void => {
  if (email.value) {
    success("Вы подписались на рассылку");
    email.value = "";
  }
};
</script>
