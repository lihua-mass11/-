import request from './request'
import type { Binding, Elder } from '@/types'

/** 读取老人档案列表 */
export async function fetchElders(): Promise<Elder[]> {
  const { data } = await request.get<Elder[]>('/elders.json')
  return data
}

/** 读取家属-老人绑定关系 */
export async function fetchBindings(): Promise<Binding[]> {
  const { data } = await request.get<Binding[]>('/bindings.json')
  return data
}
