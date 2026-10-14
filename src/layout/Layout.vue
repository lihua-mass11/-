<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useElderStore, useHealthStore, useMedicationStore, useNotificationStore, useSosStore } from '@/stores'

const elderStore = useElderStore()
const medicationStore = useMedicationStore()
const healthStore = useHealthStore()
const sosStore = useSosStore()
const notificationStore = useNotificationStore()

const loading = ref(false)

async function bootstrap() {
  loading.value = true
  try {
    await Promise.all([
      elderStore.loadElders(),
      medicationStore.init(),
      healthStore.init(),
      sosStore.init(),
      notificationStore.init(),
    ])
  } finally {
    loading.value = false
  }
}

onMounted(bootstrap)
</script>

<template>
  <div class="main-layout">
    <AppSidebar />
    <div class="main-body">
      <AppHeader />
      <main class="main-content" v-loading="loading">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  height: 100%;
}

.main-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg-page);
}
</style>
