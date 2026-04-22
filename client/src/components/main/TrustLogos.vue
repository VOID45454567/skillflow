<template>
  <section class="text-center space-y-4">
    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
      Доверяют более 300 компаний
    </p>
    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="surface-card px-5 py-2.5 rounded-full border border-white/70 text-sm font-medium text-slate-500 hover:text-blue-600 hover:border-blue-100 transition-all cursor-default"
      >
        Компания {{ String.fromCharCode(64 + i) }}
      </div>
    </div>
  </section>
</template>
