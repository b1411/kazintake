<script setup lang="ts">
definePageMeta({ layout: false })

const { isAuthenticated, isAdmin } = useMockAuth()

// Редирект авторизованных пользователей
if (import.meta.client && isAuthenticated.value) {
  navigateTo(isAdmin.value ? '/admin' : '/student/dashboard')
}

const programs = [
  {
    icon: 'i-lucide-flame',
    title: 'ПТМ',
    subtitle: 'Пожарно-технический минимум',
    description: 'Обучение и проверка знаний по вопросам пожарной безопасности. Удостоверение государственного образца.',
    color: 'text-red-500'
  },
  {
    icon: 'i-lucide-hard-hat',
    title: 'БиОТ',
    subtitle: 'Безопасность и охрана труда',
    description: 'Обучение по вопросам безопасности и охраны труда. Сертификат государственного образца.',
    color: 'text-amber-500'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'СЭЗ',
    subtitle: 'Санитарно-эпидемиологическая защищённость',
    description: 'Гигиеническое обучение лиц декретированной группы населения.',
    color: 'text-green-500'
  },
  {
    icon: 'i-lucide-siren',
    title: 'Антитеррор',
    subtitle: 'Антитеррористическая защита',
    description: 'Мероприятия по обеспечению антитеррористической защищённости объектов.',
    color: 'text-blue-500'
  },
  {
    icon: 'i-lucide-heart-pulse',
    title: 'Парамедика',
    subtitle: 'Первая доврачебная помощь',
    description: 'Обучение основным способам и методам оказания первой доврачебной помощи.',
    color: 'text-pink-500'
  },
  {
    icon: 'i-lucide-handshake',
    title: 'Согласительная комиссия',
    subtitle: 'Трудовые споры',
    description: 'Учебные мероприятия для руководителей и членов согласительных комиссий.',
    color: 'text-indigo-500'
  },
  {
    icon: 'i-lucide-scale',
    title: 'Антикоррупция',
    subtitle: 'Противодействие коррупции',
    description: 'Повышение правовой грамотности и организация антикоррупционного комплаенса.',
    color: 'text-purple-500'
  },
  {
    icon: 'i-lucide-message-circle-warning',
    title: 'Буллинг',
    subtitle: 'Буллинг / Кибербуллинг',
    description: 'Профилактика и противодействие буллингу в организациях и учебных заведениях.',
    color: 'text-orange-500'
  }
]

const stats = [
  { value: '8+', label: 'Программ обучения' },
  { value: '1000+', label: 'Обученных специалистов' },
  { value: '100%', label: 'Сертификация гос. образца' },
  { value: '24/7', label: 'Доступ к платформе' }
]

const navLinks = [
  { label: 'О компании', to: '/about' },
  { label: 'Программы', to: '/programs' },
  { label: 'Платформа', to: '#platform' },
  { label: 'Контакты', to: '#contacts' }
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center gap-2.5">
            <UIcon name="i-lucide-graduation-cap" class="size-7 text-primary" />
            <span class="font-bold text-lg tracking-tight">KAZINTAKE</span>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-1">
            <UButton
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :label="link.label"
              variant="ghost"
              color="neutral"
              size="sm"
            />
          </nav>

          <div class="flex items-center gap-2">
            <UColorModeButton />
            <UButton
              to="/login"
              label="Войти"
              icon="i-lucide-log-in"
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>

    <UMain>
      <!-- Hero -->
      <section class="relative overflow-hidden">
        <img
          src="/ala_skyline.jpg"
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black/40" />
        <div class="absolute inset-0 bg-linear-to-b from-black/20 to-black/50" />

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div class="text-center max-w-4xl mx-auto">
            <UBadge variant="subtle" size="md" class="mb-6 bg-white/15 text-white border-white/20">
              <UIcon name="i-lucide-shield" class="size-3.5 mr-1" />
              Квалификационная Комиссия Республики Казахстан
            </UBadge>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              KAZINTAKE
              <span class="text-white/70">&amp;</span>SERVICE
            </h1>

            <p class="mt-6 text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Квалификационная Комиссия, предоставляющая услуги по обеспечению безопасности и охраны труда, пожарной безопасности, гигиенического обучения, противодействию терроризму в организациях Республики Казахстан.
            </p>

            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <UButton
                to="/login"
                label="Войти в систему"
                trailing-icon="i-lucide-arrow-right"
                size="xl"
                color="neutral"
                variant="solid"
                class="light"
              />
              <UButton
                to="/programs"
                label="Наши программы"
                variant="outline"
                size="xl"
                icon="i-lucide-book-open"
                class="text-white border-white/30 hover:bg-white/10"
              />
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="text-center"
            >
              <div class="text-3xl sm:text-4xl font-extrabold text-white">
                {{ stat.value }}
              </div>
              <div class="mt-1 text-sm text-white/60">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Preview -->
      <section class="py-16 sm:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p class="text-sm font-semibold text-primary mb-2">О компании</p>
              <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Квалификационная Комиссия
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                KAZINTAKE&amp;SERVICE осуществляет свою деятельность в соответствии с законами Республики Казахстан,
                иными нормативными правовыми актами, Регламентом Квалификационной Комиссией, а также Уставом.
              </p>
              <p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                Мы обеспечиваем полный цикл корпоративного обучения — от разработки учебных программ
                до аттестации сотрудников и выдачи документов государственного образца.
              </p>
              <UButton
                to="/about"
                label="Подробнее о компании"
                trailing-icon="i-lucide-arrow-right"
                variant="outline"
                color="neutral"
                size="lg"
                class="mt-6"
              />
            </div>

            <div class="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div class="flex items-center gap-4 mb-5">
                <img
                  src="/ermek.jpg"
                  alt="Курмансеитов Ермек"
                  class="size-16 rounded-full object-cover shrink-0"
                />
                <div>
                  <p class="font-semibold text-lg text-gray-900 dark:text-white">Курмансеитов Ермек</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Директор KAZINTAKE&amp;SERVICE</p>
                </div>
              </div>
              <USeparator />
              <div class="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-map-pin" class="size-4 text-primary shrink-0" />
                  <span>г. Алматы, проспект Абая, 151/115</span>
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-phone" class="size-4 text-primary shrink-0" />
                  <a href="tel:+77719292212" class="hover:text-primary transition-colors">+7 (771) 929-22-12</a>
                </div>
                <div class="flex items-center gap-3">
                  <UIcon name="i-lucide-mail" class="size-4 text-primary shrink-0" />
                  <a href="mailto:kazintake@kazintake.kz" class="hover:text-primary transition-colors">kazintake@kazintake.kz</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Programs -->
      <section id="programs" class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <p class="text-sm font-semibold text-primary mb-2">Программы обучения</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Направления деятельности
            </h2>
            <p class="mt-4 text-gray-600 dark:text-gray-400">
              Полный спектр образовательных программ для обеспечения соответствия требованиям законодательства РК.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <UPageCard
              v-for="program in programs"
              :key="program.title"
              :title="program.title"
              :description="program.description"
              :icon="program.icon"
              variant="outline"
              spotlight
              spotlight-color="primary"
              class="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-950"
              :ui="{
                title: 'text-base',
                description: 'text-xs'
              }"
            >
              <template #header>
                <div class="px-6 pt-5 pb-0">
                  <UBadge variant="subtle" size="xs">{{ program.subtitle }}</UBadge>
                </div>
              </template>
            </UPageCard>
          </div>

          <div class="text-center mt-10">
            <UButton
              to="/programs"
              label="Все программы подробнее"
              trailing-icon="i-lucide-arrow-right"
              size="lg"
            />
          </div>
        </div>
      </section>

      <!-- Platform Features -->
      <UPageSection
        id="platform"
        headline="Платформа"
        title="Возможности LMS-системы"
        description="Полный цикл организации корпоративного обучения — от создания курсов до аттестации сотрудников."
        :features="[{
          icon: 'i-lucide-book-open',
          title: 'База курсов',
          description: 'Загрузка учебных материалов: текст, PDF-документы, ссылки на видео.'
        }, {
          icon: 'i-lucide-clipboard-check',
          title: 'Тестирование',
          description: 'Создание проверочных заданий с вариантами ответов и автоматической проверкой.'
        }, {
          icon: 'i-lucide-users',
          title: 'Управление студентами',
          description: 'Пакетный импорт, создание учётных записей, распределение по группам.'
        }, {
          icon: 'i-lucide-link',
          title: 'Назначение доступов',
          description: 'Привязка курсов к группам студентов с гибким управлением.'
        }, {
          icon: 'i-lucide-smartphone',
          title: 'Быстрый доступ',
          description: 'Авторизация по номеру телефона. Персонализированный дашборд.'
        }, {
          icon: 'i-lucide-bar-chart-2',
          title: 'Аттестация',
          description: 'Финальные тесты, фиксация оценок, отслеживание прогресса.'
        }]"
      />

      <!-- CTA -->
      <section class="py-16 sm:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 text-center">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent)]" />
            <div class="relative">
              <h2 class="text-3xl sm:text-4xl font-bold text-white">
                Готовы начать обучение?
              </h2>
              <p class="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                Войдите в систему, чтобы начать прохождение назначенных курсов и получить сертификат государственного образца.
              </p>
              <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <UButton
                  to="/login"
                  label="Войти в систему"
                  trailing-icon="i-lucide-arrow-right"
                  size="xl"
                  color="neutral"
                  variant="solid"
                  class="light"
                />
                <UButton
                  to="tel:+77719292212"
                  label="+7 (771) 929-22-12"
                  icon="i-lucide-phone"
                  size="xl"
                  variant="outline"
                  class="text-white border-white/30 hover:bg-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contacts -->
      <section id="contacts" class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <p class="text-sm font-semibold text-primary mb-2">Связаться с нами</p>
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Контакты
            </h2>
          </div>

          <div class="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <UPageCard
              icon="i-lucide-map-pin"
              title="Адрес"
              description="г. Алматы, проспект Абая, 151/115, БЦ Алатау"
              variant="subtle"
              class="bg-white dark:bg-gray-950"
            />
            <UPageCard
              icon="i-lucide-phone"
              title="Телефон"
              description="+7 (771) 929-22-12"
              variant="subtle"
              to="tel:+77719292212"
              class="bg-white dark:bg-gray-950"
            />
            <UPageCard
              icon="i-lucide-mail"
              title="Email"
              description="kazintake@kazintake.kz"
              variant="subtle"
              to="mailto:kazintake@kazintake.kz"
              class="bg-white dark:bg-gray-950"
            />
          </div>
        </div>
      </section>
    </UMain>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-graduation-cap" class="size-5 text-primary" />
            <span class="font-semibold">KAZINTAKE&amp;SERVICE</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} KAZINTAKE&amp;SERVICE — Квалификационная Комиссия
          </p>
          <div class="flex items-center gap-2">
            <UColorModeButton />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
