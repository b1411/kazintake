<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Student } from '~/composables/useMockData'

definePageMeta({ layout: 'admin', title: 'Студенты' })

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const { students, deleteStudent, addStudentsBatch, getGroups } = useMockData()
const toast = useToast()

const showImportModal = ref(false)
const importText = ref('')
const importGroup = ref('Новая группа')

const columns: TableColumn<Student>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'ФИО' },
  { accessorKey: 'phone', header: 'Телефон' },
  {
    accessorKey: 'groupName',
    header: 'Группа',
    cell: ({ row }) => {
      return h(UBadge, { variant: 'subtle', color: 'primary' }, () => row.getValue('groupName'))
    }
  },
  {
    accessorKey: 'password',
    header: 'Пароль',
    cell: ({ row }) => {
      return h('span', { class: 'font-mono text-sm text-muted' }, row.getValue('password') as string)
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return h(UButton, {
        icon: 'i-lucide-trash-2',
        color: 'error',
        variant: 'ghost',
        size: 'xs',
        square: true,
        onClick: () => handleDelete(row.original.id)
      })
    }
  }
]

function handleDelete(id: number) {
  deleteStudent(id)
  toast.add({ title: 'Студент удалён', color: 'success', icon: 'i-lucide-check-circle' })
}

function handleImport() {
  const phones = importText.value
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  if (phones.length === 0) return

  const added = addStudentsBatch(phones, importGroup.value)
  importText.value = ''
  showImportModal.value = false
  toast.add({
    title: `Импортировано: ${added.length} студентов`,
    description: phones.length !== added.length ? `${phones.length - added.length} уже существуют` : undefined,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

const groups = computed(() => getGroups())
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Все студенты ({{ students.length }})
      </h2>
      <UButton
        icon="i-lucide-upload"
        label="Импорт студентов"
        @click="showImportModal = true"
      />
    </div>

    <!-- Группы -->
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="group in groups"
        :key="group"
        variant="subtle"
        size="lg"
      >
        {{ group }} ({{ students.filter(s => s.groupName === group).length }})
      </UBadge>
    </div>

    <UTable
      :data="students"
      :columns="columns"
      class="w-full"
    />

    <!-- Модальное окно: импорт студентов -->
    <UModal
      v-model:open="showImportModal"
      title="Импорт студентов"
      description="Введите номера телефонов, по одному на строку"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Название группы"
            required
          >
            <UInput
              v-model="importGroup"
              placeholder="Группа А"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Номера телефонов (по одному на строку)"
            required
          >
            <UTextarea
              v-model="importText"
              placeholder="+7 (900) 222-0001
+7 (900) 222-0002
+7 (900) 222-0003"
              :rows="6"
              class="w-full font-mono"
            />
          </UFormField>
          <p class="text-xs text-muted">
            Система автоматически создаст учётные записи с паролями вида passN.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showImportModal = false"
          />
          <UButton
            label="Импортировать"
            icon="i-lucide-upload"
            @click="handleImport"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
