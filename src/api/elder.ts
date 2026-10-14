import request from './request'
import type { BindingVO, ElderVO } from '@/types'

/** 读取老人档案列表 */
export async function fetchElders(): Promise<ElderVO[]> {
  const { data } = await request.get<ElderVO[]>('/elders.json')
  return data
}

/** 读取家属-老人绑定关系 */
export async function fetchBindings(): Promise<BindingVO[]> {
  const { data } = await request.get<BindingVO[]>('/bindings.json')
  return data
}
