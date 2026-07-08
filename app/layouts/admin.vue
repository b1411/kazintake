<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { user, logout } = useAuth()

const navItems: NavigationMenuItem[][] = [
  [
    {
      label: 'Главная',
      icon: 'i-lucide-layout-dashboard',
      to: '/admin'
    },
    {
      label: 'Курсы',
      icon: 'i-lucide-book-open',
      to: '/admin/courses'
    },
    {
      label: 'Тесты',
      icon: 'i-lucide-clipboard-check',
      to: '/admin/tests'
    },
    {
      label: 'Обучающиеся',
      icon: 'i-lucide-users',
      to: '/admin/students'
    },
    {
      label: 'Записи на курсы',
      icon: 'i-lucide-link',
      to: '/admin/assignments'
    },
    {
      label: 'Коды доступа',
      icon: 'i-lucide-key-round',
      to: '/admin/pins'
    }
  ]
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <template #header>
        <NuxtLink
          to="/admin"
          class="flex items-center gap-2"
        >
          <AppLogo />
        </NuxtLink>
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
      />

      <template #footer>
        <div class="flex items-center justify-between gap-2 w-full">
          <UButton
            :label="user?.name"
            icon="i-lucide-shield-check"
            color="neutral"
            variant="ghost"
            class="flex-1 justify-start truncate"
          />
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            square
            @click="logout"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar :title="(route.meta.title as string) || 'Панель администратора'" />
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
