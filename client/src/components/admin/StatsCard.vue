<!-- components/admin/StatsCard.vue -->
<template>
  <div class="glass-strong rounded-2xl p-5 card-hover">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-800">{{ value }}</p>
      </div>
      <div
        class="h-12 w-12 rounded-xl flex items-center justify-center"
        :class="iconContainerClass"
      >
        <component :is="iconComponent" class="h-6 w-6" :class="iconClass" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Users, Shield, ArrowLeftRight, Wallet } from "@lucide/vue";

const props = defineProps<{
  title: string;
  value: string | number;
  icon: string;
  color: "primary" | "amber" | "accent" | "emerald";
}>();

const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    Users,
    Shield,
    ArrowLeftRight,
    Wallet,
  };
  return icons[props.icon] || Users;
});

const iconContainerClass = computed(() => {
  const classes: Record<string, string> = {
    primary: "bg-primary/20",
    amber: "bg-amber-500/20",
    accent: "bg-accent/20",
    emerald: "bg-emerald-500/20",
  };
  return classes[props.color] || "bg-primary/20";
});

const iconClass = computed(() => {
  const classes: Record<string, string> = {
    primary: "text-primary",
    amber: "text-amber-500",
    accent: "text-accent",
    emerald: "text-emerald-500",
  };
  return classes[props.color] || "text-primary";
});
</script>
