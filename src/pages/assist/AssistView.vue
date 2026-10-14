<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useElderStore } from '@/store'

const elderStore = useElderStore()

const connected = ref(false)
const connecting = ref(false)

const elder = computed(() => elderStore.currentElder)

function toggleConnect() {
  if (connected.value) {
    connected.value = false
    ElMessage.success('已断开远程连接')
    return
  }
  connecting.value = true
  // mock：模拟与老人设备建立远程连接
  setTimeout(() => {
    connecting.value = false
    connected.value = true
    ElMessage.success('已连接老人设备，正在投屏')
  }, 800)
}
</script>

<template>
  <div class="page-container">
    <!-- 连接控制栏 -->
    <div class="app-card assist-toolbar">
      <div class="assist-item">
        <span class="assist-label">协助对象</span>
        <el-select v-model="elderStore.currentElderId" style="width: 160px" placeholder="选择老人">
          <el-option v-for="e in elderStore.elders" :key="e.id" :label="e.name" :value="e.id" />
        </el-select>
      </div>

      <div class="assist-item">
        <span class="assist-label">设备状态</span>
        <span class="status-chip" :class="connected ? 'online' : 'offline'">
          <i class="status-dot"></i>
          {{ connected ? '已连接' : '未连接' }}
        </span>
      </div>

      <el-button
        :type="connected ? 'danger' : 'primary'"
        :loading="connecting"
        class="assist-btn"
        @click="toggleConnect"
      >
        <el-icon><component :is="connected ? 'SwitchButton' : 'Connection'" /></el-icon>
        {{ connected ? '断开连接' : '发起连接' }}
      </el-button>
    </div>

    <!-- 投影区 -->
    <div class="app-card assist-stage mt-16">
      <div class="app-card__title">老人设备投影</div>
      <div class="phone-wrap">
        <div class="phone" :class="{ 'is-off': !connected }">
          <div class="phone-screen">
            <template v-if="connected">
              <div class="phone-status">投屏中 · {{ elder?.name }} 的设备</div>
              <div class="phone-grid">
                <div class="grid-item">
                  <el-icon><Sunny /></el-icon>
                  <span>今日心情</span>
                  <b>良好</b>
                </div>
                <div class="grid-item">
                  <el-icon><FirstAidKit /></el-icon>
                  <span>用药进度</span>
                  <b>2 / 3</b>
                </div>
                <div class="grid-item">
                  <el-icon><AlarmClock /></el-icon>
                  <span>下一用药</span>
                  <b>14:30</b>
                </div>
                <div class="grid-item">
                  <el-icon><BellFilled /></el-icon>
                  <span>求助</span>
                  <b>无</b>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="phone-off">
                <el-icon :size="44"><VideoCamera /></el-icon>
                <p>未连接设备，点击「发起连接」查看投影</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assist-toolbar {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.assist-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assist-label {
  font-size: 14px;
  color: var(--text-regular);
}

.assist-btn {
  margin-left: auto;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 999px;
}

.status-chip.online {
  color: #52a06e;
  background: #edf6f0;
}

.status-chip.offline {
  color: #81949a;
  background: #eef1f2;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.phone-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 0 8px;
}

.phone {
  width: 260px;
  height: 480px;
  border-radius: 36px;
  border: 8px solid #23373a;
  background: #23373a;
  box-shadow: 0 12px 32px rgba(20, 50, 54, 0.25);
  overflow: hidden;
}

.phone-screen {
  height: 100%;
  border-radius: 28px;
  background: linear-gradient(180deg, #0e6b72, #14939e);
  color: #fff;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.phone.is-off .phone-screen {
  background: #eef1f2;
  color: var(--text-secondary);
}

.phone-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
}

.phone-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-item {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.grid-item .el-icon {
  font-size: 22px;
  color: #f0b181;
}

.grid-item span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.grid-item b {
  font-size: 16px;
}

.phone-off {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

.phone-off .el-icon {
  color: #b6c4c7;
}

.phone-off p {
  font-size: 13px;
  line-height: 1.6;
  padding: 0 20px;
}
</style>
