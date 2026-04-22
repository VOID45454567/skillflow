<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  AlertCircle,
  ShieldAlert,
  Ban,
  FileQuestion,
  ServerCrash,
  WifiOff,
  ArrowLeft,
  Home,
} from "@lucide/vue";

const route = useRoute();
const router = useRouter();

const errorCode = computed(() => {
  const code = route.query.code || route.params.code || history.state?.code;
  return String(code) || "404";
});

const errorMessage = computed(() => {
  const message = route.query.message || route.params.message || history.state?.message;
  return String(message) || getDefaultMessage(errorCode.value);
});

const getDefaultMessage = (code: string): string => {
  const messages: Record<string, string> = {
    "400": "Неверный запрос",
    "401": "Необходима авторизация",
    "403": "Доступ запрещен",
    "404": "Страница не найдена",
    "500": "Внутренняя ошибка сервера",
    "502": "Ошибка шлюза",
    "503": "Сервис недоступен",
  };
  return messages[code] || "Произошла ошибка";
};

const getErrorIcon = (code: string) => {
  const icons: Record<string, any> = {
    "400": AlertCircle,
    "401": ShieldAlert,
    "403": Ban,
    "404": FileQuestion,
    "500": ServerCrash,
    "502": WifiOff,
    "503": ServerCrash,
  };
  return icons[code] || AlertCircle;
};

const getErrorGradient = (code: string): string => {
  const gradients: Record<string, string> = {
    "400": "from-amber-500 to-orange-500",
    "401": "from-primary to-accent",
    "403": "from-accent-pink to-rose-500",
    "404": "from-accent-cyan to-primary",
    "500": "from-red-500 to-rose-600",
    "502": "from-purple-500 to-accent",
    "503": "from-gray-500 to-slate-600",
  };
  return gradients[code] || "from-primary to-accent-pink";
};

const errorIcon = computed(() => getErrorIcon(errorCode.value));
const gradientClass = computed(() => getErrorGradient(errorCode.value));

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 relative overflow-hidden"
  >
    <!-- Декоративные элементы -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="glass-strong rounded-3xl p-8 lg:p-12 max-w-lg w-full text-center animate-scaleIn relative"
    >
      <!-- Цифровая сетка на фоне -->
      <div class="absolute inset-0 opacity-5 pointer-events-none">
        <div
          class="w-full h-full"
          style="
            background-image: radial-gradient(
              circle at 1px 1px,
              #6366f1 1px,
              transparent 1px
            );
            background-size: 24px 24px;
          "
        ></div>
      </div>

      <div
        class="glass-strong rounded-3xl p-8 lg:p-12 max-w-lg w-full text-center animate-scaleIn"
      >
        <!-- Иконка ошибки -->
        <div class="relative mb-6">
          <div
            class="w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto shadow-xl animate-float"
            :class="gradientClass"
          >
            <component :is="errorIcon" class="w-12 h-12 text-white" />
          </div>
          <div
            class="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center shadow-md"
          >
            <AlertCircle class="w-4 h-4 text-accent-pink" />
          </div>
        </div>

        <!-- Код ошибки -->
        <h1
          class="text-6xl lg:text-7xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-accent-pink bg-clip-text text-transparent"
        >
          {{ errorCode }}
        </h1>

        <!-- Сообщение -->
        <p class="text-lg text-gray-600 mb-8">
          {{ errorMessage }}
        </p>

        <!-- Дополнительная информация -->
        <div class="p-4 rounded-xl bg-white/40 border border-gray-200/60 mb-8">
          <p class="text-sm text-gray-500">
            {{
              errorCode === "404"
                ? "Запрашиваемая страница не существует или была перемещена."
                : errorCode === "401" || errorCode === "403"
                ? "У вас недостаточно прав для доступа к этому ресурсу."
                : errorCode.startsWith("5")
                ? "Пожалуйста, попробуйте позже или обратитесь в поддержку."
                : "Что-то пошло не так. Попробуйте обновить страницу."
            }}
          </p>
        </div>

        <!-- Кнопки -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="goBack"
            class="glass px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-hover transition-all"
          >
            <ArrowLeft class="w-4 h-4" />
            Назад
          </button>
          <button
            @click="goHome"
            class="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <Home class="w-4 h-4" />
            На главную
          </button>
        </div>

        <!-- Ссылка на поддержку -->
        <p class="text-sm text-gray-400 mt-6">
          Если проблема повторяется,
          <a href="#" class="text-primary hover:text-primary-dark transition-colors">
            свяжитесь с поддержкой
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
