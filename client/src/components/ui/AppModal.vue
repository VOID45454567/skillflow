<script setup lang="ts">
import { X } from "@lucide/vue";

defineProps<{ open: boolean; title: string; description?: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <Transition name="modal">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        @click="emit('close')"
      />
      <div
        class="relative w-full max-w-lg surface-card rounded-[2rem] shadow-2xl shadow-slate-300/40 border border-white/70 animate-spring overflow-hidden"
      >
        <div
          class="px-7 pt-7 pb-5 border-b border-slate-100 flex justify-between items-start"
        >
          <div>
            <h2 class="text-xl font-bold text-slate-900">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm text-slate-500">
              {{ description }}
            </p>
          </div>
          <button
            @click="emit('close')"
            class="p-2 rounded-full hover:bg-slate-100 active:scale-90 transition-all"
          >
            <X class="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div class="px-7 py-6"><slot /></div>
        <div
          v-if="$slots.footer"
          class="px-7 py-5 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>
