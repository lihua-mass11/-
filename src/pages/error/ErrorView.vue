<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const code = computed(() => (route.query.code as string) || '404')

const content = computed(() => {
  if (code.value === '403') {
    return {
      title: '403',
      message: '请使用电脑端访问',
      desc: '家属端暂不支持移动设备访问，请在电脑浏览器中打开本系统。',
    }
  }
  return {
    title: '404',
    message: '页面不存在',
    desc: '您访问的页面不存在或已被移除，请返回首页继续操作。',
  }
})

function goHome() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-code">{{ content.title }}</div>
      <div class="error-message">{{ content.message }}</div>
      <div class="error-desc">{{ content.desc }}</div>
      <el-button type="primary" round @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-page);
}

.error-card {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 88px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #14939e, #55b8c2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 16px;
}

.error-message {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.error-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}
</style>
