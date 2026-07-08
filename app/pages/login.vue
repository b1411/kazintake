<script setup lang="ts">
definePageMeta({ layout: false })

const { adminLogin, participantLogin } = useAuth()
const toast = useToast()

const mode = ref<'participant' | 'admin'>('participant')
const loginError = ref('')
const loading = ref(false)

const phone = ref('')
const pin = ref('')
const password = ref('')

const modeItems = [
  { label: 'Курсант', value: 'participant' as const },
  { label: 'Администратор', value: 'admin' as const }
]

async function onSubmit() {
  loginError.value = ''
  loading.value = true
  try {
    if (mode.value === 'participant') {
      await participantLogin(phone.value, pin.value)
      toast.add({ title: 'Добро пожаловать!', color: 'success', icon: 'i-lucide-check-circle' })
      await navigateTo('/student/dashboard')
    } else {
      await adminLogin(phone.value, password.value)
      toast.add({ title: 'Вход выполнен', color: 'success', icon: 'i-lucide-check-circle' })
      await navigateTo('/admin')
    }
  } catch (e) {
    const err = e as { statusMessage?: string, data?: { statusMessage?: string } }
    loginError.value = err.data?.statusMessage || err.statusMessage || 'Ошибка авторизации'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/30 p-4">
    <div class="w-full max-w-md space-y-6">
      <div class="flex justify-center">
        <AppLogo class="h-8" />
      </div>

      <UPageCard>
        <div class="space-y-5">
          <div class="text-center space-y-1">
            <h1 class="text-xl font-semibold">
              Вход в систему
            </h1>
            <p class="text-sm text-muted">
              Обучающая платформа KazInTake
            </p>
          </div>

          <UTabs
            v-model="mode"
            :items="modeItems"
            :content="false"
            class="w-full"
          />

          <form
            class="space-y-4"
            @submit.prevent="onSubmit"
          >
            <UFormField
              label="Номер телефона"
              required
            >
              <UInput
                v-model="phone"
                type="tel"
                placeholder="+7 777 000 0000"
                class="w-full"
              />
            </UFormField>

            <UFormField
              v-if="mode === 'participant'"
              label="PIN-код курса"
              required
            >
              <UInput
                v-model="pin"
                placeholder="6-значный код"
                class="w-full"
              />
            </UFormField>

            <UFormField
              v-else
              label="Пароль"
              required
            >
              <UInput
                v-model="password"
                type="password"
                placeholder="Введите пароль"
                class="w-full"
              />
            </UFormField>

            <UAlert
              v-if="loginError"
              color="error"
              icon="i-lucide-alert-circle"
              :title="loginError"
            />

            <UButton
              type="submit"
              block
              label="Войти"
              :loading="loading"
            />
          </form>

          <div
            v-if="mode === 'participant'"
            class="text-xs text-muted text-center"
          >
            PIN-код курса выдаёт администратор. Код обновляется ежемесячно.
          </div>
        </div>
      </UPageCard>
    </div>
  </div>
</template>
