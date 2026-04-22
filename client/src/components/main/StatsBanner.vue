<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatsCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :value="stat.value"
      :label="stat.label"
      :color="stat.color"
      :delay="0.2 + index * 0.1"
    />
  </section>
</template>

<script setup lang="ts">
import { Layers, Users, Award } from "@lucide/vue";
import StatsCard from "@/components/main/StatsCard.vue";
import type { Component } from "vue";

interface StatItem {
  icon: Component;
  value: string;
  label: string;
  color: "primary" | "pink" | "cyan";
}

const stats: StatItem[] = [
  {
    icon: Layers,
    value: "1,234 курса",
    label: "Более тысячи курсов от ведущих организаций",
    color: "primary",
  },
  {
    icon: Users,
    value: "12,456 студентов",
    label: "Активное сообщество обучающихся",
    color: "pink",
  },
  {
    icon: Award,
    value: "856 сертификатов",
    label: "Выдано сертификатов о прохождении",
    color: "cyan",
  },
];
</script>
