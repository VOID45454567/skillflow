<!-- components/organization/dashboard/MembersManagement.vue -->
<template>
  <div class="space-y-6">
    <!-- Заголовок и кнопки -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">Участники организации</h2>
      <BaseButton @click="inviteMemberModal = true">
        <UserPlus class="h-4 w-4 mr-2" />
        Пригласить участника
      </BaseButton>
    </div>

    <!-- Информация о коде приглашения -->
    <div class="glass rounded-xl p-4 bg-primary/5 border border-primary/20">
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg bg-primary/10">
          <Key class="h-5 w-5 text-primary" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800 mb-1">
            Код приглашения для вступления
          </p>
          <div class="flex items-center gap-3">
            <code
              class="px-3 py-1.5 bg-white rounded-lg font-mono text-lg font-semibold text-primary"
            >
              {{ inviteCode }}
            </code>
            <button
              @click="copyInviteCode"
              class="text-sm text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
            >
              <Copy class="h-3.5 w-3.5" />
              Копировать
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Отправьте этот код пользователю, чтобы он мог вступить в организацию
          </p>
        </div>
      </div>
    </div>

    <!-- Список участников -->
    <div v-if="!members.length" class="glass-strong rounded-2xl p-12 text-center">
      <Users class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Нет участников</h3>
      <p class="text-gray-500 mb-6">Пригласите первых участников в вашу организацию</p>
      <BaseButton @click="inviteMemberModal = true">
        <UserPlus class="h-4 w-4 mr-2" />
        Пригласить участника
      </BaseButton>
    </div>

    <div v-else class="glass-strong rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/30 border-b border-gray-200/40">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Участник
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Роль
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Дата вступления
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/40">
            <tr
              v-for="member in members"
              :key="member.userId"
              class="hover:bg-white/20 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="member.user.avatarUrl || '/placeholder-avatar.png'"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-800">
                        {{ member.user.login }}
                      </span>
                      <Crown
                        v-if="member.userId === ownerId"
                        class="h-4 w-4 text-amber-500"
                      />
                    </div>
                    <span class="text-sm text-gray-500">{{ member.user.email }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="
                    member.userId === ownerId
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-primary/10 text-primary'
                  "
                >
                  {{ member.userId === ownerId ? "Владелец" : "Участник" }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(member.joinedAt) }}
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton
                  v-if="member.userId !== ownerId"
                  size="sm"
                  variant="ghost"
                  class="text-rose-500 hover:bg-rose-50"
                  @click="removeMember(member)"
                >
                  <Trash2 class="h-4 w-4" />
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модалка приглашения участника -->
    <InviteMemberModal
      v-model="inviteMemberModal"
      :organization-id="organizationId"
      :owner-email="ownerEmail"
      @invited="handleMemberInvited"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserPlus, Users, Key, Copy, Crown, Trash2 } from "@lucide/vue";
import BaseButton from "@/components/ui/AppButton.vue";
import InviteMemberModal from "@/components/modals/InviteMemberModal.vue";
import { useToast } from "@/composables/useToast";
import { useModal } from "@/composables/useModal";
import { useOrganizationStore } from "@/stores/organization";
import { formatDate } from "@/utils/formatters/formatDate";

const props = defineProps<{
  organizationId: number;
  members: any[];
  ownerId: number;
  inviteCode: string;
  ownerEmail: string;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const toast = useToast();
const modal = useModal();
const orgStore = useOrganizationStore();

const inviteMemberModal = ref(false);

const copyInviteCode = () => {
  navigator.clipboard.writeText(props.inviteCode);
  toast.success("Код приглашения скопирован");
};

const handleMemberInvited = () => {
  inviteMemberModal.value = false;
  toast.success("Приглашение отправлено");
  emit("refresh");
};

const removeMember = async (member: any) => {
  const confirmed = await modal.confirm({
    title: "Удаление участника",
    message: `Вы уверены, что хотите удалить пользователя "${member.user.login}" из организации?`,
    type: "danger",
    confirmText: "Удалить",
  });

  if (confirmed) {
    try {
      await orgStore.removeMember(props.organizationId, member.userId);
      toast.success("Участник удален");
      emit("refresh");
    } catch (error) {
      toast.error("Не удалось удалить участника");
    }
  }
};
</script>
