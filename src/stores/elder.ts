import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Elder } from '@/types'
import { fetchBindings, fetchElders } from '@/api'
import { useAuthStore } from './auth'

export const useElderStore = defineStore('elder', () => {
  const elders = ref<Elder[]>([])
  const currentElderId = ref<string>('')
  const loaded = ref(false)

  /** 当前登录家属绑定的老人列表 */
  const boundElders = computed(() => elders.value)

  /** 当前选中的老人 */
  const currentElder = computed(
    () => elders.value.find((e) => e.id === currentElderId.value) ?? null,
  )

  /** 加载当前家属绑定的老人 */
  async function loadElders() {
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    if (!userId) return

    const [elderList, bindings] = await Promise.all([fetchElders(), fetchBindings()])
    const boundElderIds = bindings.filter((b) => b.userId === userId).map((b) => b.elderId)
    elders.value = elderList.filter((e) => boundElderIds.includes(e.id))

    if (!currentElderId.value && elders.value.length > 0) {
      currentElderId.value = elders.value[0].id
    }
    loaded.value = true
  }

  function setCurrentElder(id: string) {
    currentElderId.value = id
  }

  return { elders, boundElders, currentElder, currentElderId, loaded, loadElders, setCurrentElder }
})
