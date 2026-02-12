<script setup lang="ts">
definePageMeta({ layout: false })

const { isAuthenticated, isAdmin } = useMockAuth()

// Редирект авторизованных пользователей
if (import.meta.client && isAuthenticated.value) {
  navigateTo(isAdmin.value ? '/admin' : '/student/dashboard')
}
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo />
        </NuxtLink>
      </template>
      <template #right>
        <UColorModeButton />
        <UButton
          to="/login"
          label="Войти"
          icon="i-lucide-log-in"
        />
      </template>
    </UHeader>

    <UMain>
      <UPageHero
        title="KazInTake"
        description="Специализированная LMS-платформа для корпоративного обучения с быстрым предоставлением доступов обучающимся."
        :links="[{
          label: 'Войти в систему',
          to: '/login',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl'
        }]"
      />

      <UPageSection
        id="features"
        title="Возможности платформы"
        description="Полный цикл организации корпоративного обучения — от создания курсов до аттестации сотрудников."
        :features="[{
          icon: 'i-lucide-book-open',
          title: 'База курсов',
          description: 'Загрузка учебных материалов: текст, PDF-документы, ссылки на видео. Структурированный контент для каждого курса.'
        }, {
          icon: 'i-lucide-clipboard-check',
          title: 'Система тестирования',
          description: 'Создание проверочных заданий с вариантами ответов. Автоматическая проверка и фиксация результатов.'
        }, {
          icon: 'i-lucide-users',
          title: 'Управление студентами',
          description: 'Пакетный импорт номеров телефонов, автоматическое создание учётных записей. Распределение по группам.'
        }, {
          icon: 'i-lucide-link',
          title: 'Назначение доступов',
          description: 'Привязка курсов к группам студентов. Гибкое управление доступом к образовательным программам.'
        }, {
          icon: 'i-lucide-smartphone',
          title: 'Быстрый доступ',
          description: 'Авторизация по номеру телефона и паролю. Персонализированный дашборд программ для каждого студента.'
        }, {
          icon: 'i-lucide-bar-chart-2',
          title: 'Аттестация и результаты',
          description: 'Прохождение финальных тестов, фиксация оценок в базе данных, отслеживание прогресса обучения.'
        }]"
      />

      <UPageSection>
        <UPageCTA
          title="Готовы начать обучение?"
          description="Войдите в систему, чтобы начать прохождение назначенных курсов."
          variant="subtle"
          :links="[{
            label: 'Войти в систему',
            to: '/login',
            trailingIcon: 'i-lucide-arrow-right',
            color: 'neutral'
          }]"
        />
      </UPageSection>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          KazInTake © {{ new Date().getFullYear() }} — Платформа корпоративного обучения
        </p>
      </template>
      <template #right>
        <UColorModeButton />
      </template>
    </UFooter>
  </div>
</template>
