<!-- components/organization/dashboard/SettingsManagement.vue -->
<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-gray-800">Настройки организации</h2>

    <div class="glass-strong rounded-2xl p-6">
      <!-- Логотип -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Логотип организации</h3>
        <div class="flex items-center gap-6">
          <div
            class="h-24 w-24 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden border-2 border-white/50"
          >
            <img
              v-if="organization.logo"
              :src="organization.logo"
              :alt="organization.name"
              class="w-full h-full object-cover"
            />
            <Building2 v-else class="h-12 w-12 text-primary" />
          </div>
          <div>
            <BaseButton @click="triggerFileInput">
              <Upload class="h-4 w-4 mr-2" />
              Загрузить логотип
            </BaseButton>
            <p class="text-xs text-gray-500 mt-2">
              Рекомендуемый размер: 512x512px. Максимум 5MB.
            </p>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleLogoUpload"
            />
          </div>
        </div>
      </div>

      <!-- Галерея -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Галерея изображений</h3>
          <BaseButton size="sm" variant="outlined" @click="triggerGalleryInput">
            <Plus class="h-4 w-4 mr-1" />
            Добавить
          </BaseButton>
        </div>

        <div
          v-if="!organization.images?.length"
          class="text-center py-8 bg-white/30 rounded-xl"
        >
          <Image class="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p class="text-sm text-gray-500">Нет изображений в галерее</p>
        </div>

        <div v-else class="grid grid-cols-4 gap-3">
          <div
            v-for="(image, index) in organization.images"
            :key="index"
            class="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              :src="image"
              :alt="`Галерея ${index + 1}`"
              class="w-full h-full object-cover"
            />
            <button
              @click="removeImage(image)"
              class="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>

        <input
          ref="galleryInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleGalleryUpload"
        />
      </div>

      <!-- Опасная зона -->
      <div class="border-t border-rose-200/40 pt-6">
        <h3 class="text-lg font-semibold text-rose-600 mb-4">Опасная зона</h3>
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800">Удалить организацию</p>
              <p class="text-sm text-gray-600">
                Это действие нельзя отменить. Все данные будут удалены.
              </p>
            </div>
            <BaseButton
              variant="outlined"
              class="text-rose-600 border-rose-300 hover:bg-rose-100"
              @click="deleteOrganization"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Удалить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Building2, Upload, Plus, Image, Trash2 } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import { useToast } from "@/composables/useToast";
import { useModal } from "@/composables/useModal";
import { useOrganizationStore } from "@/stores/organization";

const props = defineProps<{
  organization: any;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const orgStore = useOrganizationStore();
const toast = useToast();
const modal = useModal();

const fileInput = ref<HTMLInputElement>();
const galleryInput = ref<HTMLInputElement>();

const triggerFileInput = () => {
  fileInput.value?.click();
};

const triggerGalleryInput = () => {
  galleryInput.value?.click();
};

const handleLogoUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    await orgStore.uploadLogo(props.organization.id, file);
    toast.success("Логотип обновлен");
    emit("refresh");
  } catch (error) {
    toast.error("Не удалось загрузить логотип");
  }
};

const handleGalleryUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  if (!files.length) return;

  try {
    await orgStore.uploadGallery(props.organization.id, files);
    toast.success(`Загружено ${files.length} изображений`);
    emit("refresh");
  } catch (error) {
    toast.error("Не удалось загрузить изображения");
  }
};

const removeImage = async (imageUrl: string) => {
  const confirmed = await modal.confirm({
    title: "Удаление изображения",
    message: "Вы уверены, что хотите удалить это изображение из галереи?",
    type: "warning",
    confirmText: "Удалить",
  });

  if (confirmed) {
    try {
      const filename = extractFilenameFromUrl(imageUrl);
      await orgStore.removeFromGallery(props.organization.id, filename);
      toast.success("Изображение удалено");
      emit("refresh");
    } catch (error) {
      toast.error("Не удалось удалить изображение");
    }
  }
};

const deleteOrganization = async () => {
  const confirmed = await modal.confirm({
    title: "Удаление организации",
    message: `Вы уверены, что хотите удалить организацию "${props.organization.name}"? Это действие нельзя отменить, все данные будут безвозвратно удалены.`,
    type: "danger",
    confirmText: "Удалить организацию",
  });

  if (confirmed) {
    // Логика удаления
  }
};

const extractFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return decodeURIComponent(urlObj.pathname.substring(1));
  } catch {
    return url;
  }
};
</script>
