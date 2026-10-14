<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MenuBar from './menu/MenuBar.vue'
import NavBar from './navigate/NavBar.vue'
import Content from './conent/Content.vue'
import { useElderStore, useHealthStore, useMedicationStore, useNotificationStore, useSosStore } from '@/store'

const elderStore = useElderStore()
const medicationStore = useMedicationStore()
const healthStore = useHealthStore()
const sosStore = useSosStore()
const notificationStore = useNotificationStore()

const isCollapse = ref(false)
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
    <MenuBar :collapse="isCollapse" />
    <div class="main-body">
      <NavBar :collapse="isCollapse" @toggle-collapse="isCollapse = !isCollapse" />
      <Content :loading="loading" />
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
</style>
