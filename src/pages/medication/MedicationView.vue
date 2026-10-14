<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useElderStore, useMedicationStore } from '@/stores'
import { FREQUENCY_OPTIONS } from '@/constants'
import type { Medication, MedicationForm } from '@/types'

const elderStore = useElderStore()
const medicationStore = useMedicationStore()

const elder = computed(() => elderStore.currentElder)

const list = computed(() => {
  if (!elder.value) return []
  return medicationStore.medicationsOf(elder.value.id)
})

const dialogVisible = ref(false)
const editingId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const saving = ref(false)

const defaultForm = (): MedicationForm => ({
  elderId: elder.value?.id ?? '',
  name: '',
  dosage: '',
  frequency: '每日一次',
  time: '08:00',
  note: '',
  enabled: true,
})

const form = reactive<MedicationForm>(defaultForm())

const rules: FormRules = {
  name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
  dosage: [{ required: true, message: '请输入剂量', trigger: 'blur' }],
  frequency: [{ required: true, message: '请选择服用频率', trigger: 'change' }],
  time: [{ required: true, message: '请选择服用时间', trigger: 'change' }],
}

const dialogTitle = computed(() => (editingId.value ? '编辑用药计划' : '添加用药计划'))

function resetForm() {
  Object.assign(form, defaultForm())
}

function openAdd() {
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

function openEdit(row: Medication) {
  editingId.value = row.id
  Object.assign(form, {
    elderId: row.elderId,
    name: row.name,
    dosage: row.dosage,
    frequency: row.frequency,
    time: row.time,
    note: row.note ?? '',
    enabled: row.enabled,
  })
  dialogVisible.value = true
}

async function handleSave() {
  if (!formRef.value) return
  await formRef.value.validate()
  saving.value = true
  try {
    if (editingId.value) {
      medicationStore.updateMedication(editingId.value, { ...form })
      ElMessage.success('用药计划已更新')
    } else {
      medicationStore.addMedication({ ...form })
      ElMessage.success('用药计划已添加')
    }
    dialogVisible.value = false
  } finally {
    saving.value = false
  }
}

function handleDelete(row: Medication) {
  ElMessageBox.confirm(`确定删除「${row.name}」的用药计划吗？`, '删除确认', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      medicationStore.removeMedication(row.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function handleToggle(row: Medication) {
  medicationStore.toggleEnabled(row.id)
  ElMessage.success(row.enabled ? '已停用' : '已启用')
}
</script>

<template>
  <div class="page-container">
    <div class="app-card">
      <div class="flex-between mb-16">
        <div class="app-card__title" style="margin-bottom: 0">
          {{ elder?.name }} 的用药计划
        </div>
        <el-button type="primary" @click="openAdd">
          <el-icon><Plus /></el-icon>
          添加用药
        </el-button>
      </div>

      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="name" label="药品名称" min-width="140">
          <template #default="{ row }">
            <span class="med-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dosage" label="剂量" width="100" />
        <el-table-column prop="frequency" label="频率" width="110" />
        <el-table-column prop="time" label="服用时间" width="110">
          <template #default="{ row }">
            <span class="med-time">{{ row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="text-secondary">{{ row.note || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" effect="light" round>
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row as Medication)">编辑</el-button>
            <el-button link :type="row.enabled ? 'warning' : 'success'" size="small" @click="handleToggle(row as Medication)">
              {{ row.enabled ? '停用' : '启用' }}
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row as Medication)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="86px">
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="form.name" placeholder="如：硝苯地平缓释片" />
        </el-form-item>
        <el-form-item label="剂量" prop="dosage">
          <el-input v-model="form.dosage" placeholder="如：10mg" />
        </el-form-item>
        <el-form-item label="服用频率" prop="frequency">
          <el-select v-model="form.frequency" placeholder="请选择" style="width: 100%">
            <el-option v-for="f in FREQUENCY_OPTIONS" :key="f" :label="f" :value="f" />
          </el-select>
        </el-form-item>
        <el-form-item label="服用时间" prop="time">
          <el-time-picker
            v-model="form.time"
            value-format="HH:mm"
            format="HH:mm"
            placeholder="选择时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" :rows="2" placeholder="如：早餐后服用（选填）" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.med-name {
  font-weight: 500;
  color: var(--text-primary);
}

.med-time {
  font-weight: 600;
  color: var(--brand-primary);
}
</style>
