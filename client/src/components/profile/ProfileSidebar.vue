<template>
  <div class="glass-strong rounded-3xl p-6 space-y-6">
    <div class="flex flex-col items-center">
      <label class="relative cursor-pointer group">
        <img
          :src="user.avatarUrl || '/placeholder-avatar.png'"
          class="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity"
        />
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Upload class="h-6 w-6 text-white" />
        </div>
        <input type="file" class="hidden" @change="handleFileChange" accept="image/*" />
      </label>
      <h2 class="mt-4 text-xl font-bold text-gray-800">{{ user.login }}</h2>
      <div class="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <Mail class="h-3.5 w-3.5" /> {{ user.email }}
      </div>
      <div class="mt-2">
        <span
          class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
          :class="{
            'bg-primary/10 text-primary': user.role === 'USER',
            'bg-accent/10 text-accent': user.role === 'ADMIN',
          }"
        >
          {{ user.role === "ADMIN" ? "Администратор" : "Пользователь" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail, Upload } from "@lucide/vue";
import type { User } from "@/types/user";

defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  uploadAvatar: [formData: FormData];
}>();

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files?.length) return;

  const formData = new FormData();
  formData.append("avatar", files[0]);
  emit("uploadAvatar", formData);
};
</script>
