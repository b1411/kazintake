<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({ layout: false })

const { login } = useMockAuth()
const toast = useToast()
const loginError = ref('')

const fields: AuthFormField[] = [
  {
    name: 'phone',
    type: 'tel',
    label: 'Номер телефона',
    placeholder: '+7 (900) 000-0001',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Пароль',
    placeholder: 'Введите пароль',
    required: true
  }
]

const schema = z.object({
  phone: z.string().min(1, 'Введите номер телефона'),
  password: z.string().min(1, 'Введите пароль')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  loginError.value = ''
  const result = login(payload.data.phone, payload.data.password)
  if (result.success) {
    const { user } = useMockAuth()
    toast.add({ title: 'Добро пожаловать!', description: `Вы вошли как ${user.value?.name}`, color: 'success', icon: 'i-lucide-check-circle' })
    if (user.value?.role === 'admin') {
      navigateTo('/admin')
    } else {
      navigateTo('/student/dashboard')
    }
  } else {
    loginError.value = result.error || 'Ошибка авторизации'
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
        <UAuthForm
          :schema="schema"
          :fields="fields"
          title="Вход в систему"
          description="Введите ваши учётные данные для доступа к платформе."
          icon="i-lucide-lock"
          :submit="{ label: 'Войти' }"
          @submit="onSubmit"
        >
          <template
            v-if="loginError"
            #validation
          >
            <UAlert
              color="error"
              icon="i-lucide-alert-circle"
              :title="loginError"
            />
          </template>

          <template #footer>
            <div class="space-y-3 text-sm text-muted">
              <USeparator />
              <p class="font-medium">
                Тестовые учётные записи:
              </p>
              <div class="space-y-1">
                <p><strong>Админ:</strong> +7 (900) 000-0001 / admin123</p>
                <p><strong>Студент:</strong> +7 (900) 111-0001 / student1</p>
              </div>
            </div>
          </template>
        </UAuthForm>
      </UPageCard>
    </div>
  </div>
</template>
