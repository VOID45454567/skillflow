<template>
  <div class="min-h-[calc(100vh-8rem)] py-8 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <ProfileHeader @logout="handleLogout" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileSidebar :user="user" @upload-avatar="handleUploadAvatar" />

        <div class="lg:col-span-2 space-y-6">
          <ProfileStatsGrid
            :user="user"
            @open-balance="balanceModal = true"
            @open-payments="paymentsModal = true"
            @open-2fa="twoFactorModal = true"
            @verify="handleVerification"
          />

          <!-- Тепловая карта активности -->
          <HeatmapCard :heatmap="user.heatmapDatas" />

          <TransactionsQuickView
            :transactions="sortedTransactions"
            @view-all="transactionsModal = true"
          />

          <CoursesSection
            :created-courses="createdCourses"
            :purchased-courses="purchasedCourses"
            :user="user"
          />
        </div>
      </div>
    </div>

    <BalanceModal
      v-model="balanceModal"
      :current-balance="user.balance"
      @confirm="handleBalanceUp"
    />

    <TwoFactorModal
      v-model="twoFactorModal"
      :enabled="user.enabledTwoFactor"
      @confirm="handleToggleTwoFactor"
    />

    <TransactionsModal v-model="transactionsModal" :transactions="sortedTransactions" />

    <PaymentsModal v-model="paymentsModal" :payments="user.payments" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/composables/useToast";
import { PaymentMethod } from "@/types/enums/common-info";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";

import ProfileHeader from "@/components/profile/ProfileHeader.vue";
import ProfileSidebar from "@/components/profile/ProfileSidebar.vue";
import ProfileStatsGrid from "@/components/profile/ProfileStatsGrid.vue";
import HeatmapCard from "@/components/profile/HeatmapCard.vue";
import TransactionsQuickView from "@/components/profile/TransactionsQuickView.vue";
import CoursesSection from "@/components/profile/CoursesSection.vue";
import BalanceModal from "@/components/profile/BalanceModal.vue";
import TwoFactorModal from "@/components/profile/TwoFactorModal.vue";
import TransactionsModal from "@/components/profile/TransactionsModal.vue";
import PaymentsModal from "@/components/profile/PaymentsModal.vue";

const userStore = useUserStore();
const authStore = useAuthStore();
const { success, error: showError } = useToast();

const user = computed(() => authStore.currentUser!);

const balanceModal = ref(false);
const transactionsModal = ref(false);
const paymentsModal = ref(false);
const twoFactorModal = ref(false);

const createdCourses = computed(
  () => user.value.courses?.filter((c) => c.userId === user.value.id) || []
);

const purchasedCourses = computed(() => user.value.purchasedCourses || []);

const sortedTransactions = computed(() => {
  return [...(user.value.transactions || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (err) {
    console.error(err);
  }
};

const handleUploadAvatar = async (formData: FormData) => {
  try {
    await authStore.uploadAvatar(formData);
    success("Аватар успешно обновлен");
  } catch (err) {
    showError("Не удалось загрузить аватар");
  }
};

const handleBalanceUp = async (amount: number, method: PaymentMethod) => {
  try {
    const oldBalance = user.value.balance;
    await userStore.balanceUp(amount, method);
    user.value.balance += amount;
    success(`Баланс пополнен на ${amount} 💎. Текущий баланс: ${oldBalance + amount} 💎`);
    balanceModal.value = false;
    user.value.payments.push({
      count: amount,
      method: method,
      userId: user.value.id,
      user: user.value,
      createdAt: Date.now().toString(),
      id: Date.now(),
    });
  } catch (err) {
    showError("Не удалось пополнить баланс");
  }
};

const handleToggleTwoFactor = async () => {
  try {
    if (user.value.enabledTwoFactor) {
      await authStore.disable2fa();
      user.value.enabledTwoFactor = false;
      success("Двухфакторная аутентификация отключена");
    } else {
      await authStore.enable2fa();
      user.value.enabledTwoFactor = true;
      success("Двухфакторная аутентификация включена");
    }
    twoFactorModal.value = false;
  } catch (err) {
    showError("Не удалось изменить настройки 2FA");
  }
};

const handleVerification = async () => {
  try {
    await authStore.sendAccountToVerification();
    success("Заявка на верификацию отправлена");
    user.value.verificationStatus = UserVerificationStatuses.PENDING;
  } catch (err) {
    showError("Не удалось отправить заявку");
  }
};

onMounted(async () => {
  await authStore.getMe();
});
</script>
