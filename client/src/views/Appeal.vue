<!-- views/AppealPage.vue -->
<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 animate-fadeInUp">
        <div
          class="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/20 to-accent-pink/20 flex items-center justify-center mx-auto mb-4"
        >
          <MessageSquare class="h-10 w-10 text-rose-500" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Подача апелляции</h1>
        <p class="text-gray-500">
          Оспорьте блокировку вашего аккаунта, отправив апелляцию администрации
        </p>
      </div>

      <!-- Если апелляция уже подана -->
      <div v-if="hasExistingAppeal" class="glass-strong rounded-2xl p-6 animate-fadeInUp">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-amber-500/10 shrink-0">
            <Clock class="h-6 w-6 text-amber-500" />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Статус апелляции</h2>
            <div class="flex items-center gap-3 mb-3">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
              >
                На рассмотрении
              </span>
              <span class="text-xs text-gray-400">
                Подана {{ formatDate(existingAppeal!.createdAt) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3">
              Ваша апелляция находится на рассмотрении у администрации. Ответ будет дан в
              течение 3 рабочих дней.
            </p>
            <div class="p-4 glass rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Текст апелляции</p>
              <p class="text-sm text-gray-700">{{ existingAppeal!.text }}</p>
            </div>

            <!-- Кнопка назад -->
            <div class="flex gap-3 pt-4">
              <BaseButton variant="outlined" class="flex-1" @click="goBack">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Назад
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Если апелляция еще не подана -->
      <template v-else>
        <!-- Информация о блокировке -->
        <div
          v-if="blockInfo"
          class="glass-strong rounded-2xl p-6 mb-6 animate-fadeInUp"
          style="animation-delay: 0.1s"
        >
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-rose-500/10 shrink-0">
              <Ban class="h-6 w-6 text-rose-500" />
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800 mb-3">
                Информация о блокировке
              </h2>

              <div class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="p-3 glass rounded-xl">
                    <p class="text-xs text-gray-500 mb-1">Дата блокировки</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ formatDate(blockInfo.createdAt) }}
                    </p>
                  </div>
                  <div class="p-3 glass rounded-xl">
                    <p class="text-xs text-gray-500 mb-1">Заблокировал</p>
                    <div class="flex items-center gap-2">
                      <img
                        :src="
                          blockInfo.bannedByUser?.avatarUrl || '/placeholder-avatar.png'
                        "
                        class="h-5 w-5 rounded-full"
                      />
                      <p class="text-sm font-medium text-gray-800">
                        {{ blockInfo.bannedByUser?.login || "Администратор" }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="p-4 glass rounded-xl border-l-4 border-l-rose-500">
                  <p class="text-xs text-gray-500 mb-1">Причина блокировки</p>
                  <p class="text-sm text-gray-800">
                    {{ blockInfo.blockReason }}
                  </p>
                </div>

                <div
                  class="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-xl"
                >
                  <AlertCircle class="h-4 w-4 shrink-0" />
                  <span>
                    Вы можете подать только одну апелляцию. Ответ будет дан в течение 3
                    рабочих дней.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Сообщение если нет информации о блокировке -->
        <div v-else class="glass-strong rounded-2xl p-12 text-center animate-fadeInUp">
          <Shield class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            Нет активной блокировки
          </h3>
          <p class="text-gray-500 mb-6">
            Ваш аккаунт не заблокирован. Апелляция не требуется.
          </p>
          <BaseButton @click="goBack">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Назад
          </BaseButton>
        </div>

        <!-- Форма апелляции -->
        <div
          v-if="blockInfo"
          class="glass-strong rounded-2xl p-6 animate-fadeInUp"
          style="animation-delay: 0.2s"
        >
          <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText class="h-5 w-5 text-primary" />
            Текст апелляции
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-600">
                Опишите вашу ситуацию
                <span class="text-rose-500">*</span>
              </label>
              <textarea
                v-model="appealText"
                rows="6"
                placeholder="Укажите причины, по которым вы считаете блокировку несправедливой. Опишите ситуацию подробно, это поможет администрации быстрее разобраться в вашем деле..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                :class="{
                  'border-rose-500 focus:border-rose-500 focus:ring-rose-200': textError,
                }"
              ></textarea>
              <div class="flex items-center justify-between">
                <p v-if="textError" class="text-xs text-rose-500">{{ textError }}</p>
                <p v-else class="text-xs text-gray-400">Минимум 20 символов</p>
                <p class="text-xs text-gray-400">{{ appealText.length }} / 1000</p>
              </div>
            </div>

            <!-- Правила подачи апелляции -->
            <div class="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
              <p class="text-xs text-gray-600 mb-2 font-medium">
                Рекомендации по составлению апелляции:
              </p>
              <ul class="space-y-1.5">
                <li class="flex items-start gap-2 text-xs text-gray-500">
                  <CheckCircle class="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Будьте вежливы и конструктивны</span>
                </li>
                <li class="flex items-start gap-2 text-xs text-gray-500">
                  <CheckCircle class="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Укажите, почему вы считаете блокировку ошибочной</span>
                </li>
                <li class="flex items-start gap-2 text-xs text-gray-500">
                  <CheckCircle class="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Приложите доказательства, если они у вас есть</span>
                </li>
                <li class="flex items-start gap-2 text-xs text-gray-500">
                  <CheckCircle class="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Объясните, почему вы больше не нарушите правила</span>
                </li>
              </ul>
            </div>

            <!-- Подтверждение -->
            <div class="flex items-start gap-3 p-4 bg-white/40 rounded-xl">
              <input
                v-model="agreed"
                type="checkbox"
                id="agree"
                class="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label for="agree" class="text-sm text-gray-600">
                Я подтверждаю, что предоставленная информация достоверна, и понимаю, что
                подача ложной информации может привести к продлению срока блокировки или
                полной блокировке аккаунта.
              </label>
            </div>

            <!-- Кнопки -->
            <div class="flex gap-3 pt-3">
              <BaseButton variant="outlined" class="flex-1" @click="goBack">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Назад
              </BaseButton>
              <BaseButton
                class="flex-1"
                :disabled="!isFormValid || submitting"
                @click="handleSubmit"
              >
                <Loader2 v-if="submitting" class="h-4 w-4 mr-2 animate-spin" />
                <Send v-else class="h-4 w-4 mr-2" />
                {{ submitting ? "Отправка..." : "Отправить апелляцию" }}
              </BaseButton>
            </div>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  MessageSquare,
  Ban,
  AlertCircle,
  FileText,
  CheckCircle,
  ArrowLeft,
  Send,
  Clock,
  Shield,
  Loader2,
} from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import { formatDate } from "@/utils/formatters/formatDate";
import type { BlockInfo } from "@/types/blockInfo";
import type { Appeal } from "@/types/appeal";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const userStore = useUserStore();
const user = computed(() => authStore.currentUser);
const appealText = ref("");
const agreed = ref(false);
const textError = ref("");
const submitting = ref(false);
const existingAppeal = ref<Appeal | null>(null);
const loading = ref(true);

const blockInfo = computed<BlockInfo | null>(() => {
  const bannedByUsers = user.value?.bannedByUsers;
  if (!bannedByUsers || bannedByUsers.length === 0) return null;
  return bannedByUsers[0];
});

const hasExistingAppeal = computed(() => !!existingAppeal.value);

const isFormValid = computed(() => {
  return appealText.value.length >= 20 && appealText.value.length <= 1000 && agreed.value;
});

const loadAppeal = async () => {
  if (!user.value) return;

  try {
    loading.value = true;
    const appeal = user.value.appeals[0];
    existingAppeal.value = appeal!;
  } catch (error) {
    console.error("Failed to load appeal:", error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!blockInfo.value) {
    toast.error("Информация о блокировке не найдена");
    return;
  }

  if (appealText.value.length < 20) {
    textError.value = "Текст апелляции должен содержать минимум 20 символов";
    return;
  }

  if (appealText.value.length > 1000) {
    textError.value = "Текст апелляции не должен превышать 1000 символов";
    return;
  }

  textError.value = "";
  submitting.value = true;

  try {
    await userStore.sendAppeal(blockInfo.value.id, appealText.value);

    toast.success("Апелляция успешно подана");

    await loadAppeal();
  } catch (error: any) {
    console.error("Failed to submit appeal:", error);
    toast.error(error?.response?.data?.message || "Не удалось подать апелляцию");
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(async () => {
  await authStore.getMe();
  await loadAppeal();

  console.log("User:", user.value);
  console.log("Block info:", blockInfo.value);
  console.log("Ban info ID:", blockInfo.value?.id);
});
</script>

<style scoped>
.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
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
</style>
