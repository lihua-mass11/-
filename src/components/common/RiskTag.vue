<script setup lang="ts">
import { computed } from 'vue'
import type { RiskLevel } from '@/types'
import { RISK_LEVEL_META } from '@/types'

const props = defineProps<{ level: RiskLevel }>()

const meta = computed(() => RISK_LEVEL_META[props.level])
</script>

<template>
  <span class="risk-tag" :style="{ color: meta.color, backgroundColor: meta.bg }">
    <span class="risk-dot" :style="{ backgroundColor: meta.color }"></span>
    {{ meta.label }}
  </span>
</template>

<style scoped>
.risk-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}

.risk-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
