<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores'
import type { LoginForm } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive<LoginForm>({ username: 'family01', password: '123456' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate()
  loading.value = true
  try {
    await authStore.login(form.username, form.password)
    ElMessage.success('登录成功，欢迎回来')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (e) {
    ElMessage.error((e as Error).message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-brand">
      <div class="brand-inner">
        <div class="brand-logo">
          <svg viewBox="0 0 64 64" width="46" height="46">
            <circle cx="32" cy="24" r="11" fill="#f5f3ef" />
            <path d="M11 55c0-12 9.5-19.5 21-19.5S53 43 53 55" fill="#f5f3ef" />
            <circle cx="32" cy="45" r="8" fill="#e07a3f" />
          </svg>
        </div>
        <h1 class="brand-title">银龄守护</h1>
        <p class="brand-slogan">让每一份牵挂，都有迹可循</p>
        <ul class="brand-features">
          <li><el-icon><Check /></el-icon>老人状态实时看板</li>
          <li><el-icon><Check /></el-icon>用药提醒与打卡管理</li>
          <li><el-icon><Check /></el-icon>紧急求助及时通知</li>
        </ul>
      </div>
    </div>

    <div class="login-form-panel">
      <div class="login-card">
        <div class="login-card__head">
          <h2>家属端登录</h2>
          <p>请使用家属账号登录系统</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="large"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入账号" clearable>
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
            >
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form>

        <div class="login-tip">
          <el-icon><InfoFilled /></el-icon>
          演示账号：family01 / 123456
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: 100%;
  display: flex;
}

.login-brand {
  flex: 1.1;
  background: linear-gradient(160deg, #2d6a4f 0%, #1f4232 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.brand-inner {
  max-width: 380px;
}

.brand-logo {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.brand-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.brand-slogan {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
}

.brand-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
}

.brand-features .el-icon {
  color: #f2b488;
}

.login-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-page);
}

.login-card {
  width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 8px 40px rgba(45, 60, 53, 0.08);
  border: 1px solid var(--border-color);
}

.login-card__head {
  margin-bottom: 28px;
}

.login-card__head h2 {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.login-card__head p {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-btn {
  width: 100%;
  margin-top: 4px;
  font-weight: 600;
  letter-spacing: 4px;
}

.login-tip {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
