<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Коды доступа' })

interface PinRow { courseId: number, courseTitle: string, period: string, pin: string }

const toast = useToast()
const { data: pins, refresh } = await useFetch<PinRow[]>('/api/admin/pins', { default: () => [] })

const rotatingId = ref<number | null>(null)

async function rotate(courseId: number) {
  rotatingId.value = courseId
  try {
    await $fetch(`/api/admin/pins/${courseId}/rotate`, { method: 'POST' })
    await refresh()
    toast.add({ title: 'Код обновлён', color: 'success', icon: 'i-lucide-check-circle' })
  } finally {
    rotatingId.value = null
  }
}

async function copyPin(pin: string) {
  try {
    await navigator.clipboard.writeText(pin)
    toast.add({ title: 'Код скопирован', color: 'success', icon: 'i-lucide-copy' })
  } catch {
    // clipboard недоступен
  }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-xl font-semibold">
        Коды доступа к курсам
      </h2>
      <p class="text-sm text-muted">
        PIN обновляется ежемесячно. Курсант входит по номеру телефона и коду своего курса.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <UCard
        v-for="row in pins"
        :key="row.courseId"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="font-medium truncate">
              {{ row.courseTitle }}
            </p>
            <p class="text-xs text-muted">
              Период: {{ row.period }}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              class="font-mono text-xl font-bold tracking-widest tabular-nums px-3 py-1 rounded-md bg-muted/40 hover:bg-muted/70 transition-colors"
              title="Скопировать"
              @click="copyPin(row.pin)"
            >
              {{ row.pin }}
            </button>
            <UButton
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="outline"
              size="sm"
              square
              :loading="rotatingId === row.courseId"
              title="Обновить код"
              @click="rotate(row.courseId)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
