<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Назначения' })

const { courses, students, assignments, addAssignment, removeAssignment, getGroups, getStudentsByGroup } = useMockData()
const toast = useToast()

const showAssignModal = ref(false)
const selectedCourseId = ref<number | null>(null)
const selectedGroup = ref('')

const courseOptions = computed(() =>
  courses.value.map(c => ({ label: c.title, value: c.id }))
)

const groupOptions = computed(() =>
  getGroups().map(g => ({ label: `${g} (${getStudentsByGroup(g).length} чел.)`, value: g }))
)

// Данные для таблицы назначений
const assignmentRows = computed(() =>
  assignments.value.map((a) => {
    const course = courses.value.find(c => c.id === a.courseId)
    return {
      id: a.id,
      courseId: a.courseId,
      courseTitle: course?.title || `Курс #${a.courseId}`,
      studentCount: a.studentIds.length,
      assignedAt: a.assignedAt,
      studentIds: a.studentIds
    }
  })
)

function handleAssign() {
  if (!selectedCourseId.value || !selectedGroup.value) return

  const groupStudents = getStudentsByGroup(selectedGroup.value)
  addAssignment(selectedCourseId.value, groupStudents.map(s => s.id))

  toast.add({
    title: 'Доступ назначен',
    description: `${groupStudents.length} студентов получили доступ`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })

  selectedCourseId.value = null
  selectedGroup.value = ''
  showAssignModal.value = false
}

function handleRemoveStudent(courseId: number, studentId: number) {
  removeAssignment(courseId, studentId)
  toast.add({ title: 'Студент убран из назначения', color: 'success', icon: 'i-lucide-check-circle' })
}

// Развернутые строки
const expandedRows = ref<Set<number>>(new Set())
function toggleRow(id: number) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Назначения курсов ({{ assignments.length }})
      </h2>
      <UButton
        icon="i-lucide-plus"
        label="Назначить курс"
        @click="showAssignModal = true"
      />
    </div>

    <div
      v-if="assignmentRows.length === 0"
      class="text-center py-12 text-muted"
    >
      Назначений пока нет.
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <UCard
        v-for="row in assignmentRows"
        :key="row.id"
      >
        <div class="space-y-3">
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleRow(row.id)"
          >
            <div class="flex items-center gap-3">
              <UIcon
                :name="expandedRows.has(row.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="size-5 text-muted"
              />
              <div>
                <p class="font-medium">
                  {{ row.courseTitle }}
                </p>
                <p class="text-sm text-muted">
                  Назначен: {{ row.assignedAt }}
                </p>
              </div>
            </div>
            <UBadge variant="subtle">
              {{ row.studentCount }} студентов
            </UBadge>
          </div>

          <div
            v-if="expandedRows.has(row.id)"
            class="pl-8 space-y-2"
          >
            <div
              v-for="studentId in row.studentIds"
              :key="studentId"
              class="flex items-center justify-between py-1.5"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-user"
                  class="size-4 text-muted"
                />
                <span class="text-sm">{{ students.find(s => s.id === studentId)?.name || `#${studentId}` }}</span>
                <UBadge
                  variant="subtle"
                  color="neutral"
                  size="xs"
                >
                  {{ students.find(s => s.id === studentId)?.groupName }}
                </UBadge>
              </div>
              <UButton
                icon="i-lucide-x"
                color="error"
                variant="ghost"
                size="xs"
                square
                @click.stop="handleRemoveStudent(row.courseId, studentId)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Модальное окно: назначить курс -->
    <UModal
      v-model:open="showAssignModal"
      title="Назначить курс группе"
      description="Выберите курс и группу студентов"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Курс"
            required
          >
            <USelect
              v-model="selectedCourseId"
              :items="courseOptions"
              placeholder="Выберите курс"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Группа"
            required
          >
            <USelect
              v-model="selectedGroup"
              :items="groupOptions"
              placeholder="Выберите группу"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showAssignModal = false"
          />
          <UButton
            label="Назначить"
            icon="i-lucide-link"
            @click="handleAssign"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
