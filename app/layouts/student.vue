<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user, logout } = useAuth()
const route = useRoute()

const navItems: NavigationMenuItem[][] = [
  [
    {
      label: 'Мои курсы',
      icon: 'i-lucide-book-open',
      to: '/student/dashboard'
    }
  ]
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <template #header>
        <NuxtLink
          to="/student/dashboard"
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
            icon="i-lucide-user"
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
        <UDashboardNavbar :title="(route.meta.title as string) || 'Личный кабинет'" />
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
