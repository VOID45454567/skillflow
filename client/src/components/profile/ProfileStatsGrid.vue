<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <BalanceCard
      :balance="user.balance"
      @add="emit('open-balance')"
      @history="emit('open-payments')"
    />

    <TwoFactorCard :enabled="user.enabledTwoFactor" @toggle="emit('open-2fa')" />

    <VerificationCard :status="user.verificationStatus" @verify="emit('verify')" />
  </div>
</template>

<script setup lang="ts">
import type { User } from "@/types/user";
import BalanceCard from "./BalanceCard.vue";
import TwoFactorCard from "./TwoFactorCard.vue";
import VerificationCard from "./VerificationCard.vue";

defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  openBalance: [];
  openPayments: [];
  open2fa: [];
  verify: [];
}>();
</script>
