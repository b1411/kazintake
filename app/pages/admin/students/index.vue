<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'admin', title: 'Обучающиеся' })

interface ParticipantRow { id: number, fullName: string, phone: string, createdAt: string, courseIds: number[] }
interface CourseRow { id: number, title: string }

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const toast = useToast()
const { data: participants, refresh } = await useFetch<ParticipantRow[]>('/api/admin/participants', { default: () => [] })
const { data: courses } = await useFetch<CourseRow[]>('/api/admin/courses', { default: () => [] })

const courseOptions = computed(() => courses.value.map(c => ({ label: c.title, value: c.id })))
function courseTitle(id: number) {
  return courses.value.find(c => c.id === id)?.title ?? `#${id}`
}

const showAddModal = ref(false)
const form = reactive({ fullName: '', phone: '', courseIds: [] as number[] })
const addError = ref('')

const columns: TableColumn<ParticipantRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'fullName', header: 'ФИО' },
  { accessorKey: 'phone', header: 'Телефон' },
  {
    accessorKey: 'courseIds',
    header: 'Курсы',
    cell: ({ row }) => h(UBadge, { variant: 'subtle', color: 'primary' }, () => `${(row.getValue('courseIds') as number[]).length}`)
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h(UButton, {
      icon: 'i-lucide-trash-2', color: 'error', variant: 'ghost', size: 'xs', square: true,
      onClick: () => handleDelete(row.original.id)
    })
  }
]

async function handleDelete(id: number) {
  await $fetch(`/api/admin/participants/${id}`, { method: 'DELETE' })
  await refresh()
  toast.add({ title: 'Обучающийся удалён', color: 'success', icon: 'i-lucide-check-circle' })
}

async function handleAdd() {
  addError.value = ''
  if (!form.fullName.trim() || !form.phone.trim()) return
  try {
    await $fetch('/api/admin/participants', {
      method: 'POST',
      body: { fullName: form.fullName, phone: form.phone, courseIds: form.courseIds }
    })
    form.fullName = ''
    form.phone = ''
    form.courseIds = []
    showAddModal.value = false
    await refresh()
    toast.add({ title: 'Обучающийся добавлен', color: 'success', icon: 'i-lucide-check-circle' })
  } catch (e) {
    const err = e as { data?: { statusMessage?: string } }
    addError.value = err.data?.statusMessage || 'Ошибка добавления'
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Все обучающиеся ({{ participants.length }})
      </h2>
      <UButton
        icon="i-lucide-user-plus"
        label="Добавить обучающегося"
        @click="showAddModal = true"
      />
    </div>

    <UTable
      :data="participants"
      :columns="columns"
      class="w-full"
    />

    <UModal
      v-model:open="showAddModal"
      title="Новый обучающийся"
      description="ФИО, телефон и курсы для записи"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="ФИО"
            required
          >
            <UInput
              v-model="form.fullName"
              placeholder="Иванов Иван Иванович"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Номер телефона"
            required
          >
            <UInput
              v-model="form.phone"
              type="tel"
              placeholder="+7 777 000 0000"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Записать на курсы">
            <USelectMenu
              v-model="form.courseIds"
              :items="courseOptions"
              value-key="value"
              multiple
              placeholder="Выберите курсы"
              class="w-full"
            />
          </UFormField>
          <div
            v-if="form.courseIds.length"
            class="flex flex-wrap gap-1"
          >
            <UBadge
              v-for="id in form.courseIds"
              :key="id"
              variant="subtle"
              size="xs"
            >
              {{ courseTitle(id) }}
            </UBadge>
          </div>
          <UAlert
            v-if="addError"
            color="error"
            icon="i-lucide-alert-circle"
            :title="addError"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showAddModal = false"
          />
          <UButton
            label="Добавить"
            icon="i-lucide-user-plus"
            @click="handleAdd"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
