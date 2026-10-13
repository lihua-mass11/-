import request from './request'
import type { User } from '@/types'

/** 读取家属账号列表 */
export async function fetchUsers(): Promise<User[]> {
  const { data } = await request.get<User[]>('/users.json')
  return data
}

/** 登录：本地匹配账号密码 */
export async function login(username: string, password: string): Promise<User> {
  const users = await fetchUsers()
  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) {
    throw new Error('账号或密码错误')
  }
  return user
}
