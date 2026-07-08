<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Записи на курсы' })

interface ParticipantRow { id: number, fullName: string, phone: string, courseIds: number[] }
interface CourseRow { id: number, title: string }

const toast = useToast()
const { data: participants, refresh } = await useFetch<ParticipantRow[]>('/api/admin/participants', { default: () => [] })
const { data: courses } = await useFetch<CourseRow[]>('/api/admin/courses', { default: () => [] })

const showModal = ref(false)
const selectedParticipantId = ref<number>()
const selectedCourseId = ref<number>()

const participantOptions = computed(() =>
  participants.value.map(p => ({ label: `${p.fullName} (${p.phone})`, value: p.id }))
)
const courseOptions = computed(() => courses.value.map(c => ({ label: c.title, value: c.id })))

// Строки по курсам: кто записан
const rows = computed(() =>
  courses.value.map(c => ({
    course: c,
    members: participants.value.filter(p => p.courseIds.includes(c.id))
  })).filter(r => r.members.length > 0)
)

const expanded = ref<Set<number>>(new Set())
function toggle(id: number) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

async function handleAssign() {
  if (!selectedParticipantId.value || !selectedCourseId.value) return
  await $fetch('/api/admin/enrollments', {
    method: 'POST',
    body: { participantId: selectedParticipantId.value, courseId: selectedCourseId.value }
  })
  selectedParticipantId.value = undefined
  selectedCourseId.value = undefined
  showModal.value = false
  await refresh()
  toast.add({ title: 'Курсант записан', color: 'success', icon: 'i-lucide-check-circle' })
}

async function handleRemove(participantId: number, courseId: number) {
  await $fetch('/api/admin/enrollments', { method: 'DELETE', query: { participantId, courseId } })
  await refresh()
  toast.add({ title: 'Запись удалена', color: 'success', icon: 'i-lucide-check-circle' })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Записи на курсы
      </h2>
      <UButton
        icon="i-lucide-plus"
        label="Записать на курс"
        @click="showModal = true"
      />
    </div>

    <div
      v-if="rows.length === 0"
      class="text-center py-12 text-muted"
    >
      Записей пока нет.
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <UCard
        v-for="row in rows"
        :key="row.course.id"
      >
        <div class="space-y-3">
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggle(row.course.id)"
          >
            <div class="flex items-center gap-3">
              <UIcon
                :name="expanded.has(row.course.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="size-5 text-muted"
              />
              <p class="font-medium">
                {{ row.course.title }}
              </p>
            </div>
            <UBadge variant="subtle">
              {{ row.members.length }} курсантов
            </UBadge>
          </div>

          <div
            v-if="expanded.has(row.course.id)"
            class="pl-8 space-y-2"
          >
            <div
              v-for="p in row.members"
              :key="p.id"
              class="flex items-center justify-between py-1.5"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-user"
                  class="size-4 text-muted"
                />
                <span class="text-sm">{{ p.fullName }}</span>
                <span class="text-xs text-muted font-mono">{{ p.phone }}</span>
              </div>
              <UButton
                icon="i-lucide-x"
                color="error"
                variant="ghost"
                size="xs"
                square
                @click.stop="handleRemove(p.id, row.course.id)"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UModal
      v-model:open="showModal"
      title="Записать курсанта на курс"
      description="Выберите курсанта и курс"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Курсант"
            required
          >
            <USelect
              v-model="selectedParticipantId"
              :items="participantOptions"
              placeholder="Выберите курсанта"
              class="w-full"
            />
          </UFormField>
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
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Отмена"
            color="neutral"
            variant="outline"
            @click="showModal = false"
          />
          <UButton
            label="Записать"
            icon="i-lucide-link"
            @click="handleAssign"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
