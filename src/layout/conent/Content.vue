<script setup lang="ts">
defineProps<{ loading: boolean }>()
</script>

<template>
  <main class="app-content" v-loading="loading">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
.app-content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-page);
}
</style>
