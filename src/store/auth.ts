import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { login as apiLogin } from '@/api'

const TOKEN_KEY = 'eldercare_token'
const USER_KEY = 'eldercare_user'

function loadStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref<User | null>(loadStoredUser())

  const isAuthenticated = computed(() => !!token.value)
  const displayName = computed(() => user.value?.name ?? user.value?.username ?? '')

  async function login(username: string, password: string) {
    const matched = await apiLogin(username, password)
    user.value = matched
    token.value = `mock-token-${matched.id}-${Date.now()}`
    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(matched))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, user, isAuthenticated, displayName, login, logout }
})
