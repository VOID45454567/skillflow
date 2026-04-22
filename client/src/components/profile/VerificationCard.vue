<template>
  <div class="glass-strong rounded-2xl p-5 card-hover">
    <div class="flex items-center gap-3 mb-3">
      <div
        class="h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0"
        :class="config.gradient"
      >
        <CheckCircle class="h-5 w-5" :class="config.iconColor" />
      </div>
      <span class="text-sm font-medium text-gray-500">Верификация</span>
    </div>

    <div class="flex items-center justify-between mb-1">
      <span class="text-lg font-bold text-gray-800">
        {{ statusLabel }}
      </span>

      <span
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
        :class="config.badgeClass"
      >
        <span class="relative flex h-1.5 w-1.5">
          <span
            v-if="status === UserVerificationStatuses.PENDING"
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-1.5 w-1.5"
            :class="config.dotColor"
          ></span>
        </span>
      </span>
    </div>

    <div
      v-if="config.showProgress"
      class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden"
    >
      <div
        class="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"
      ></div>
    </div>

    <p v-if="config.message" class="text-xs mt-1" :class="config.iconColor">
      {{ config.message }}
    </p>

    <BaseButton
      v-if="status !== UserVerificationStatuses.VERIFIED"
      size="sm"
      variant="tonal"
      class="mt-3 w-full"
      :class="config.buttonClass"
      @click="$emit('verify')"
      :disabled="status === UserVerificationStatuses.PENDING"
    >
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CheckCircle } from "@lucide/vue";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import { mapVerificationStatus } from "@/utils/mappers/mapUserVerificationStatus";
import BaseButton from "@/components/ui/AppButton.vue";

const props = defineProps<{
  status: UserVerificationStatuses;
}>();

defineEmits<{
  verify: [];
}>();

const statusLabel = computed(() => mapVerificationStatus(props.status).status);
const buttonText = computed(() => mapVerificationStatus(props.status).buttonText);

const config = computed(() => {
  const configs = {
    [UserVerificationStatuses.UNVERIFIED]: {
      gradient: "from-accent-pink/20 to-accent/20",
      iconColor: "text-accent-pink",
      badgeClass: "bg-accent-pink/10 text-accent-pink",
      dotColor: "bg-accent-pink",
      buttonClass: "text-accent-pink bg-accent-pink/10 hover:bg-accent-pink/20",
      showProgress: false,
      message: "",
    },
    [UserVerificationStatuses.PENDING]: {
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
      badgeClass: "bg-amber-100 text-amber-700",
      dotColor: "bg-amber-500",
      buttonClass: "text-amber-600 bg-amber-50 hover:bg-amber-100",
      showProgress: true,
      message: "",
    },
    [UserVerificationStatuses.REJECTED]: {
      gradient: "from-rose-500/20 to-accent-pink/20",
      iconColor: "text-rose-500",
      badgeClass: "bg-rose-100 text-rose-700",
      dotColor: "bg-rose-500",
      buttonClass: "text-rose-600 bg-rose-50 hover:bg-rose-100",
      showProgress: false,
      message: "Заявка отклонена. Попробуйте снова.",
    },
    [UserVerificationStatuses.VERIFIED]: {
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
      badgeClass: "bg-emerald-100 text-emerald-700",
      dotColor: "bg-emerald-500",
      buttonClass: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
      showProgress: false,
      message: "",
    },
  };

  return configs[props.status] || configs[UserVerificationStatuses.UNVERIFIED];
});
</script>
