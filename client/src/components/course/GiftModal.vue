<template>
  <AppModal
    :model-value="modelValue"
    title="Подарить курс"
    description="Выберите пользователя, которому хотите подарить курс"
    width="xl"
    @close="close"
  >
    <div class="space-y-4">
      <div class="glass rounded-xl p-4 bg-linear-to-r from-primary/5 to-accent/5">
        <div class="flex items-center gap-3">
          <Gift class="h-5 w-5 text-primary" />
          <div>
            <p class="font-medium text-gray-800">{{ courseTitle }}</p>
            <p class="text-sm text-gray-500">Стоимость: {{ formatPrice(price) }}</p>
          </div>
        </div>
      </div>

      <!-- Search Input -->
      <div class="relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск пользователя по логину или email..."
          class="w-full pl-11 pr-4 py-3 rounded-xl glass border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          @input="handleSearch"
        />
      </div>

      <!-- Search Results -->
      <div
        v-if="searchQuery && searchResults.length"
        class="max-h-64 overflow-y-auto space-y-2"
      >
        <div
          v-for="user in searchResults"
          :key="user.id"
          class="glass rounded-xl p-3 cursor-pointer hover:bg-surface-hover transition-all"
          :class="{ 'border-2 border-primary': selectedUser?.id === user.id }"
          @click="selectUser(user)"
        >
          <div class="flex items-center gap-3">
            <img
              :src="user.avatarUrl || '/placeholder-avatar.png'"
              class="h-10 w-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <p class="font-medium text-gray-800">{{ user.login }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
            <CheckCircle
              v-if="selectedUser?.id === user.id"
              class="h-5 w-5 text-primary"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="searchQuery && !searchResults.length && !isSearching"
        class="text-center py-8"
      >
        <User class="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p class="text-gray-500">Пользователь не найден</p>
      </div>

      <div v-else-if="isSearching" class="text-center py-8">
        <Loader class="h-8 w-8 mx-auto mb-3 text-primary animate-spin" />
        <p class="text-gray-500">Поиск...</p>
      </div>

      <!-- Selected User -->
      <div
        v-if="selectedUser"
        class="glass rounded-xl p-4 bg-accent/5 border border-accent/20"
      >
        <p class="text-sm text-gray-500 mb-2">Выбранный получатель:</p>
        <div class="flex items-center gap-3">
          <img
            :src="selectedUser.avatarUrl || '/placeholder-avatar.png'"
            class="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p class="font-medium text-gray-800">{{ selectedUser.login }}</p>
            <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <AppButton variant="outlined" class="flex-1" @click="close"> Отмена </AppButton>
        <AppButton class="flex-1" :disabled="!selectedUser" @click="handleGift">
          <Gift class="h-4 w-4 mr-2" />
          Подарить
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Search, Gift, User, CheckCircle, Loader } from "@lucide/vue";
import AppModal from "@/components/common/Modal.vue";
import AppButton from "@/components/ui/AppButton.vue";

const props = defineProps<{
  modelValue: boolean;
  courseId?: number;
  courseTitle?: string;
  price?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  gift: [data: { userId: number; courseId: number }];
}>();

const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const selectedUser = ref<any>(null);
const isSearching = ref(false);

let searchTimeout: ReturnType<typeof setTimeout>;

function handleSearch() {
  clearTimeout(searchTimeout);

  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimeout = setTimeout(async () => {
    // Implement API search logic
    // const results = await userStore.searchUsers(searchQuery.value)
    // searchResults.value = results
    isSearching.value = false;
  }, 300);
}

function selectUser(user: any) {
  selectedUser.value = user;
}

function handleGift() {
  if (selectedUser.value && props.courseId) {
    emit("gift", {
      userId: selectedUser.value.id,
      courseId: props.courseId,
    });
  }
}

function close() {
  emit("update:modelValue", false);
  searchQuery.value = "";
  searchResults.value = [];
  selectedUser.value = null;
}

function formatPrice(price?: number): string {
  if (!price) return "0 ₽";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      close();
    }
  }
);
</script>
