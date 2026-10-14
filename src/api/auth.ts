import request from './request'
import type { UserVO } from '@/types'

/** mock 环境下，注册账号保存在本地 */
const REGISTERED_USERS_KEY = 'eldercare_registered_users'

function loadRegisteredUsers(): UserVO[] {
  const raw = localStorage.getItem(REGISTERED_USERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as UserVO[]
  } catch {
    return []
  }
}

function saveRegisteredUsers(users: UserVO[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
}

/** 读取家属账号列表（含本地注册的账号） */
export async function fetchUsers(): Promise<UserVO[]> {
  const { data } = await request.get<UserVO[]>('/users.json')
  return [...data, ...loadRegisteredUsers()]
}

/** 登录：本地匹配账号密码 */
export async function login(username: string, password: string): Promise<UserVO> {
  const users = await fetchUsers()
  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) {
    throw new Error('账号或密码错误')
  }
  return user
}

/** 注册：校验账号唯一后写入本地账号列表 */
export async function register(form: {
  name: string
  phone: string
  username: string
  password: string
}): Promise<UserVO> {
  const users = await fetchUsers()
  if (users.some((u) => u.username === form.username)) {
    throw new Error('该账号已被注册，请更换账号')
  }

  const user: UserVO = {
    id: `u${Date.now()}`,
    username: form.username,
    password: form.password,
    name: form.name,
    phone: form.phone,
    avatar: '',
  }
  saveRegisteredUsers([...loadRegisteredUsers(), user])
  return user
}
