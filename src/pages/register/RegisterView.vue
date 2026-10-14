<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register as apiRegister } from '@/api'
import type { RegisterDTO } from '@/types'

const router = useRouter()

const formRef = ref<FormInstance>()
const loading = ref(false)
const agreed = ref(false)

const form = reactive<RegisterDTO>({
  name: '',
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度需在 4-20 个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度需在 6-20 位之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (value !== form.password) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

async function handleRegister() {
  if (!formRef.value) return
  await formRef.value.validate()
  if (!agreed.value) {
    ElMessage.warning('请先阅读并同意用户协议')
    return
  }

  loading.value = true
  try {
    await apiRegister({
      name: form.name,
      phone: form.phone,
      username: form.username,
      password: form.password,
    })
    ElMessage.success('注册成功，请登录')
    router.push({ name: 'login', query: { username: form.username } })
  } catch (e) {
    ElMessage.error((e as Error).message || '注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-brand">
      <div class="brand-inner">
        <div class="brand-logo">
          <svg viewBox="0 0 64 64" width="46" height="46">
            <circle cx="32" cy="24" r="11" fill="#f5f8f8" />
            <path d="M11 55c0-12 9.5-19.5 21-19.5S53 43 53 55" fill="#f5f8f8" />
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

    <div class="register-form-panel">
      <div class="register-card">
        <div class="register-card__head">
          <h2>家属端注册</h2>
          <p>创建家属账号，开启守护之旅</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          size="large"
          @keyup.enter="handleRegister"
        >
          <el-form-item prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable>
              <template #prefix><el-icon><UserFilled /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" clearable maxlength="11">
              <template #prefix><el-icon><Iphone /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入账号（4-20 位）" clearable>
              <template #prefix><el-icon><User /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码（6-20 位）"
              show-password
              clearable
            >
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
              clearable
            >
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="agreed" class="agreement">
              我已阅读并同意
              <a class="agreement-link" href="javascript:;">《用户服务协议》</a>与
              <a class="agreement-link" href="javascript:;">《隐私政策》</a>
            </el-checkbox>
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="register-btn"
            :loading="loading"
            @click="handleRegister"
          >
            注 册
          </el-button>
        </el-form>

        <div class="register-footer">
          已有账号？<router-link class="login-link" :to="{ name: 'login' }">返回登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  height: 100%;
  display: flex;
}

.register-brand {
  flex: 1.1;
  background: linear-gradient(160deg, #14939e 0%, #0e6b72 100%);
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
  color: #f0b181;
}

.register-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-page);
}

.register-card {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 36px 36px 28px;
  box-shadow: 0 8px 40px rgba(45, 60, 53, 0.08);
  border: 1px solid var(--border-color);
}

.register-card__head {
  margin-bottom: 24px;
}

.register-card__head h2 {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.register-card__head p {
  font-size: 14px;
  color: var(--text-secondary);
}

.register-btn {
  width: 100%;
  margin-top: 4px;
  font-weight: 600;
  letter-spacing: 4px;
}

.agreement {
  font-size: 13px;
  color: var(--text-regular);
}

.agreement-link {
  color: var(--brand-primary);
  text-decoration: none;
}

.register-footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  font-size: 13px;
  color: var(--text-secondary);
}

.login-link {
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 500;
}
</style>
