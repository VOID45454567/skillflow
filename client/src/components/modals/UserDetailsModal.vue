<!-- components/admin/UserDetailsModal.vue -->
<template>
  <Modal :model-value="!!modelValue" @close="$emit('close')" width="lg">
    <div v-if="user" class="space-y-5">
      <!-- Заголовок -->
      <div class="flex items-center gap-4">
        <img
          :src="user.avatarUrl || '/placeholder-avatar.png'"
          class="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h3 class="text-xl font-bold text-gray-800">{{ user.login }}</h3>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 border-b border-gray-200/40 pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="
            activeTab === tab.id
              ? 'bg-primary/10 text-primary'
              : 'text-gray-500 hover:bg-white/40'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Контент вкладок -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Информация -->
        <div v-if="activeTab === 'info'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 glass rounded-xl">
              <p class="text-xs text-gray-500 mb-1">ID пользователя</p>
              <p class="text-lg font-semibold text-gray-800">#{{ user.id }}</p>
            </div>
            <div class="p-4 glass rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Роль</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ user.role === "ADMIN" ? "Администратор" : "Пользователь" }}
              </p>
            </div>
            <div class="p-4 glass rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Баланс</p>
              <p class="text-lg font-semibold text-gray-800">{{ user.balance }} 💎</p>
            </div>
            <div class="p-4 glass rounded-xl">
              <p class="text-xs text-gray-500 mb-1">2FA</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ user.enabledTwoFactor ? "Включена" : "Отключена" }}
              </p>
            </div>
          </div>

          <div class="p-4 glass rounded-xl">
            <p class="text-xs text-gray-500 mb-2">Статус верификации</p>
            <span
              v-if="!user.bannedByUsers?.length"
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getVerificationClass(user.verificationStatus)"
            >
              {{ mapVerificationStatus(user.verificationStatus) }}
            </span>
            <span
              v-else
              class="px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700"
            >
              Заблокирован
            </span>
          </div>

          <div class="p-4 glass rounded-xl">
            <p class="text-xs text-gray-500 mb-2">Даты</p>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Регистрация:</span>
                <span class="text-sm text-gray-800">{{
                  formatDate(user.createdAt)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Обновление:</span>
                <span class="text-sm text-gray-800">{{
                  formatDate(user.updatedAt)
                }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="user.bannedByUsers?.length"
            class="p-4 glass rounded-xl border border-rose-200"
          >
            <p class="text-xs text-rose-500 mb-2 flex items-center gap-1">
              <Ban class="h-4 w-4" />
              Пользователь заблокирован
            </p>
            <div class="space-y-2">
              <div>
                <p class="text-xs text-gray-500">Причина:</p>
                <p class="text-sm text-gray-800">
                  {{ user.bannedByUsers[0]?.blockReason || "—" }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Заблокировал:</p>
                <p class="text-sm text-gray-800">
                  {{ user.bannedByUsers[0]?.bannedByUser?.login || "—" }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Дата блокировки:</p>
                <p class="text-sm text-gray-800">
                  {{ formatDate(user.bannedByUsers[0]?.createdAt || "") }}
                </p>
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div class="p-4 glass rounded-xl">
            <p class="text-xs text-gray-500 mb-2">Статистика</p>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Создано курсов:</span>
                <span class="text-sm font-medium text-gray-800">{{
                  user._count?.courses || 0
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Куплено курсов:</span>
                <span class="text-sm font-medium text-gray-800">{{
                  user._count?.purchasedCourses || 0
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Транзакций:</span>
                <span class="text-sm font-medium text-gray-800">{{
                  user._count?.transactions || 0
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Платежей:</span>
                <span class="text-sm font-medium text-gray-800">{{
                  user._count?.payments || 0
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Транзакции -->
        <div v-else-if="activeTab === 'transactions'" class="space-y-3">
          <div v-if="loadingTransactions" class="text-center py-8">
            <Loader2 class="h-6 w-6 mx-auto text-primary animate-spin" />
          </div>
          <div v-else-if="!userTransactions.length" class="text-center py-8">
            <ArrowLeftRight class="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500">Нет транзакций</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="tx in userTransactions" :key="tx.id" class="p-3 glass rounded-xl">
              <div class="flex items-center justify-between">
                <div>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeClass(tx.type)"
                  >
                    {{ getTypeLabel(tx.type) }}
                  </span>
                  <p class="text-sm text-gray-700 mt-1">{{ tx.course?.title || "—" }}</p>
                  <p
                    v-if="tx.type === 'GIFT' && tx.giftUser"
                    class="text-xs text-gray-500 mt-0.5"
                  >
                    Получатель: {{ tx.giftUser.login }}
                  </p>
                </div>
                <span
                  class="text-sm font-medium"
                  :class="tx.type === 'REFUND' ? 'text-emerald-600' : 'text-rose-600'"
                >
                  {{ tx.type === "REFUND" ? "+" : "-" }}{{ tx.price }} 💎
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(tx.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Платежи -->
        <div v-else-if="activeTab === 'payments'" class="space-y-3">
          <div v-if="loadingPayments" class="text-center py-8">
            <Loader2 class="h-6 w-6 mx-auto text-primary animate-spin" />
          </div>
          <div v-else-if="!userPayments.length" class="text-center py-8">
            <CreditCard class="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500">Нет платежей</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="payment in userPayments"
              :key="payment.id"
              class="p-3 glass rounded-xl"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getMethodClass(payment.method)"
                  >
                    {{ getMethodLabel(payment.method) }}
                  </span>
                </div>
                <span class="text-sm font-medium text-emerald-600">
                  +{{ payment.count }} 💎
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatDate(payment.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Курсы -->
        <div v-else-if="activeTab === 'courses'" class="space-y-3">
          <div
            v-if="!user.courses?.length && !user.purchasedCourses?.length"
            class="text-center py-8"
          >
            <BookOpen class="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500">Нет курсов</p>
          </div>

          <div v-if="user.courses?.length">
            <p class="text-xs font-medium text-gray-500 mb-2">Созданные курсы</p>
            <div class="space-y-2">
              <div
                v-for="course in user.courses"
                :key="course.id"
                class="p-3 glass rounded-xl"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ course.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ course.lessons?.length || 0 }} уроков ·
                      {{ course.isFree ? "Бесплатный" : formatPrice(course.price) }}
                    </p>
                  </div>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getVisibilityClass(course.visibility)"
                  >
                    {{ getVisibilityLabel(course.visibility) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Купленные курсы -->
          <div v-if="user.purchasedCourses?.length" class="mt-4">
            <p class="text-xs font-medium text-gray-500 mb-2">Купленные курсы</p>
            <div class="space-y-2">
              <div
                v-for="course in user.purchasedCourses"
                :key="course.id"
                class="p-3 glass rounded-xl"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ course.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Автор: {{ course.user?.login || "—" }}
                    </p>
                  </div>
                  <router-link
                    :to="{ name: 'single-course-page', params: { id: course.id } }"
                    class="text-primary hover:text-primary-dark text-sm"
                  >
                    Просмотр →
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex gap-3 pt-3 border-t border-gray-200/40">
        <BaseButton
          v-if="!user.bannedByUsers?.length"
          variant="outlined"
          class="text-rose-500 flex-1"
          @click="openBlockModal"
        >
          <Ban class="h-4 w-4 mr-2" />
          Заблокировать
        </BaseButton>
        <BaseButton v-else class="text-emerald-500 flex-1" @click="openUnblockModal">
          <CheckCircle class="h-4 w-4 mr-2" />
          Разблокировать
        </BaseButton>
        <BaseButton
          v-if="user.verificationStatus === 'PENDING'"
          variant="outlined"
          class="text-primary flex-1"
          @click="openApproveModal"
        >
          <CheckCircle class="h-4 w-4 mr-2" />
          Верифицировать
        </BaseButton>
        <BaseButton variant="outlined" class="flex-1" @click="$emit('close')">
          Закрыть
        </BaseButton>
      </div>
    </div>
  </Modal>

  <ConfirmModal
    v-model="confirmModal.show"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :type="confirmModal.type"
    :confirm-text="confirmModal.confirmText"
    :require-reason="confirmModal.requireReason"
    :reason-placeholder="confirmModal.reasonPlaceholder"
    @confirm="confirmModal.onConfirm"
    @close="confirmModal.show = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from "vue";
import {
  Ban,
  CheckCircle,
  ArrowLeftRight,
  CreditCard,
  Loader2,
  BookOpen,
} from "@lucide/vue";
import Modal from "@/components/common/Modal.vue";
import BaseButton from "@/components/ui/AppButton.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import { useAdminStore } from "@/stores/admin";
import { useToast } from "@/composables/useToast";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import { TransactionType, PaymentMethod } from "@/types/enums/common-info";
import { CourseVisibilityTypes } from "@/types/enums/course-visibility-types";
import { AdminActionTypes } from "@/types/enums/admin-action-types";
import { formatDate } from "@/utils/formatters/formatDate";
import type { User } from "@/types/user";
import type { Transaction } from "@/types/transaction";
import type { Payment } from "@/types/payment";

const props = defineProps<{
  modelValue: User | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: User | null];
  close: [];
}>();

const store = useAdminStore();
const toast = useToast();

const user = ref<User | null>(null);
const activeTab = ref<"info" | "transactions" | "payments" | "courses">("info");
const loadingTransactions = ref(false);
const loadingPayments = ref(false);
const userTransactions = ref<Transaction[]>([]);
const userPayments = ref<Payment[]>([]);

const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  type: "info" as "warning" | "info" | "danger" | "success",
  confirmText: "Подтвердить",
  requireReason: true,
  reasonPlaceholder: "",
  onConfirm: (_reason: string) => {},
});

const tabs = [
  { id: "info" as const, label: "Информация" },
  { id: "courses" as const, label: "Курсы" },
  { id: "transactions" as const, label: "Транзакции" },
  { id: "payments" as const, label: "Платежи" },
];

watch(
  () => props.modelValue,
  async (val) => {
    user.value = val;
    console.log(user.value);

    if (val) {
      activeTab.value = "info";
      userTransactions.value = [];
      userPayments.value = [];
    }
  }
);

watch(activeTab, async (tab) => {
  if (!user.value) return;

  if (tab === "transactions" && !userTransactions.value.length) {
    loadingTransactions.value = true;
    userTransactions.value = user.value.transactions;
    loadingTransactions.value = false;
  }

  if (tab === "payments" && !userPayments.value.length) {
    loadingPayments.value = true;
    userPayments.value = await store.fetchUserPayments(user.value.id);
    loadingPayments.value = false;
  }
});

const getVerificationClass = (status: UserVerificationStatuses): string => {
  const classes: Record<UserVerificationStatuses, string> = {
    VERIFIED: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    REJECTED: "bg-rose-100 text-rose-700",
    UNVERIFIED: "bg-gray-100 text-gray-600",
  };
  return classes[status] || "bg-gray-100 text-gray-600";
};

const mapVerificationStatus = (status: UserVerificationStatuses): string => {
  const map: Record<UserVerificationStatuses, string> = {
    VERIFIED: "Верифицирован",
    PENDING: "На проверке",
    REJECTED: "Отклонен",
    UNVERIFIED: "Не верифицирован",
  };
  return map[status] || status;
};

const getTypeClass = (type: TransactionType): string => {
  const classes: Record<TransactionType, string> = {
    PURCHASE: "bg-primary/10 text-primary",
    REFUND: "bg-emerald-100 text-emerald-700",
    GIFT: "bg-accent-pink/10 text-accent-pink",
  };
  return classes[type] || "bg-gray-100 text-gray-600";
};

const getTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    PURCHASE: "Покупка",
    REFUND: "Возврат",
    GIFT: "Подарок",
  };
  return labels[type] || type;
};

const getMethodClass = (method: PaymentMethod): string => {
  const classes: Record<PaymentMethod, string> = {
    CARD: "bg-primary/10 text-primary",
    SBP: "bg-accent-cyan/10 text-accent-cyan",
  };
  return classes[method] || "bg-gray-100 text-gray-600";
};

const getMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    CARD: "Банковская карта",
    SBP: "СБП",
  };
  return labels[method] || method;
};

const getVisibilityClass = (visibility: CourseVisibilityTypes): string => {
  const classes: Record<CourseVisibilityTypes, string> = {
    ORGANIZATION: "bg-accent/10 text-accent",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    DRAFT: "bg-gray-100 text-gray-600",
  };
  return classes[visibility] || "bg-gray-100 text-gray-600";
};

const getVisibilityLabel = (visibility: CourseVisibilityTypes): string => {
  const labels: Record<CourseVisibilityTypes, string> = {
    ORGANIZATION: "Организация",
    PUBLISHED: "Опубликован",
    DRAFT: "Черновик",
  };
  return labels[visibility] || visibility;
};

const formatPrice = (price?: number): string => {
  if (!price) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
};

const openBlockModal = () => {
  if (!user.value) return;

  confirmModal.show = true;
  confirmModal.title = "Блокировка пользователя";
  confirmModal.message = `Вы уверены, что хотите заблокировать пользователя "${user.value.login}"?`;
  confirmModal.type = "danger";
  confirmModal.confirmText = "Заблокировать";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину блокировки...";
  confirmModal.onConfirm = async (reason?: string) => {
    const success = await store.blockUser(user.value!.id, reason!);
    if (success) {
      toast.success(`Пользователь ${user.value!.login} заблокирован`);
      emit("close");
    } else {
      toast.error("Ошибка блокировки");
    }
    confirmModal.show = false;
  };
};

const openUnblockModal = () => {
  if (!user.value) return;

  confirmModal.show = true;
  confirmModal.title = "Разблокировка пользователя";
  confirmModal.message = `Вы уверены, что хотите разблокировать пользователя "${user.value.login}"?`;
  confirmModal.type = "success";
  confirmModal.confirmText = "Разблокировать";
  confirmModal.requireReason = true;
  confirmModal.reasonPlaceholder = "Укажите причину разблокировки...";
  confirmModal.onConfirm = async (reason?: string) => {
    const success = await store.unblockUser(user.value!.id, reason!);
    if (success) {
      toast.success(`Пользователь ${user.value!.login} разблокирован`);
      emit("close");
    } else {
      toast.error("Ошибка разблокировки");
    }
    confirmModal.show = false;
  };
};

const openApproveModal = () => {
  if (!user.value) return;

  confirmModal.show = true;
  confirmModal.title = "Подтверждение верификации";
  confirmModal.message = `Подтвердить верификацию пользователя "${user.value.login}"?`;
  confirmModal.type = "success";
  confirmModal.confirmText = "Подтвердить";
  confirmModal.requireReason = true;
  confirmModal.onConfirm = async (reason: string) => {
    const success = await store.setVerificationStatus(
      user.value!.id,
      UserVerificationStatuses.VERIFIED,
      reason,
      AdminActionTypes.VERIFY
    );
    if (success) {
      toast.success(`Верификация пользователя ${user.value!.login} подтверждена`);
      emit("close");
    } else {
      toast.error("Ошибка подтверждения");
    }
    confirmModal.show = false;
  };
};
</script>
