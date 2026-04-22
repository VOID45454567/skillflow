<template>
  <div class="text-center py-16">
    <component :is="icon" class="h-16 w-16 mx-auto text-gray-300 mb-4" />
    <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-4">{{ description }}</p>
    <router-link
      v-if="type === 'created'"
      :to="{ name: 'create-course' }"
      class="btn-primary px-6 py-2 rounded-xl text-white text-sm font-medium inline-flex items-center gap-2"
    >
      <Plus class="h-4 w-4" />
      Создать курс
    </router-link>
    <router-link
      v-else-if="type === 'purchased'"
      :to="{ name: 'public-courses' }"
      class="btn-primary px-6 py-2 rounded-xl text-white text-sm font-medium"
    >
      Перейти в каталог
    </router-link>
    <router-link
      v-else-if="type === 'active'"
      :to="{ name: 'my-courses', query: { tab: 'purchased' } }"
      class="btn-primary px-6 py-2 rounded-xl text-white text-sm font-medium"
    >
      Мои курсы
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Award, ShoppingBag, PlayCircle, Plus, Search } from "@lucide/vue";

const props = defineProps<{
  type: "created" | "purchased" | "active";
  filter?: string;
}>();

const config = computed(() => {
  const configs = {
    created: {
      icon: Award,
      title: "У вас пока нет созданных курсов",
      description: "Создайте свой первый курс и начните делиться знаниями",
    },
    purchased: {
      icon: ShoppingBag,
      title: getPurchasedTitle(),
      description: getPurchasedDescription(),
    },
    active: {
      icon: PlayCircle,
      title: "Нет активных курсов",
      description: "Начните проходить купленные курсы",
    },
  };
  return configs[props.type];
});

const getPurchasedTitle = () => {
  if (props.filter === "in-progress") return "Нет курсов в процессе";
  if (props.filter === "completed") return "Нет завершённых курсов";
  if (props.filter === "not-started") return "Нет не начатых курсов";
  return "У вас пока нет купленных курсов";
};

const getPurchasedDescription = () => {
  if (props.filter !== "all") return "Измените фильтр или перейдите в каталог";
  return "Перейдите в каталог и выберите курс для обучения";
};

const icon = computed(() => config.value.icon);
const title = computed(() => config.value.title);
const description = computed(() => config.value.description);
</script>
