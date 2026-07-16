<script setup lang="ts">
definePageMeta({ layout: false })

const navLinks = [
  { label: 'Главная', to: '/' },
  { label: 'Программы', to: '/programs' },
  { label: 'Контакты', to: '/#contacts' }
]

const milestones = [
  { year: '2015', text: 'Основание Квалификационной Комиссии в г. Алматы' },
  { year: '2016', text: 'Аккредитация по программам ПТМ и БиОТ' },
  { year: '2018', text: 'Расширение программ: Антитеррор, Согласительная комиссия' },
  { year: '2020', text: 'Переход на онлайн-формат обучения, запуск LMS-платформы' },
  { year: '2022', text: 'Добавление программ Антикоррупция и Буллинг/Кибербуллинг' },
  { year: '2024', text: 'Более 1000 обученных специалистов, обновление платформы' }
]

const values = [
  {
    icon: 'i-lucide-shield-check',
    title: 'Легитимность',
    description: 'Все программы соответствуют законодательству Республики Казахстан и актуальным нормативно-правовым актам.'
  },
  {
    icon: 'i-lucide-award',
    title: 'Качество',
    description: 'Государственные сертификаты и удостоверения, признаваемые всеми контролирующими органами Казахстана.'
  },
  {
    icon: 'i-lucide-users',
    title: 'Доступность',
    description: 'Онлайн-формат обучения и удобная LMS-платформа с доступом 24/7 из любой точки страны.'
  },
  {
    icon: 'i-lucide-target',
    title: 'Практичность',
    description: 'Учебные программы ориентированы на реальные потребности предприятий и организаций.'
  }
]

const _team = [
  {
    name: 'Курмансеитов Ермек',
    role: 'Директор',
    description: 'Руководитель Квалификационной Комиссии. Координация деятельности комиссии.'
  }
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Gov Links Bar -->
    <div class="bg-gray-900 dark:bg-gray-950 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-8 text-xs">
          <div class="hidden sm:flex items-center gap-4">
            <a
              href="https://egov.kz"
              target="_blank"
              rel="noopener"
              class="text-gray-400 hover:text-white transition-colors"
            >eGov.kz</a>
            <a
              href="https://www.gov.kz/memleket/entities/edu"
              target="_blank"
              rel="noopener"
              class="text-gray-400 hover:text-white transition-colors"
            >Мин. просвещения</a>
            <a
              href="https://www.gov.kz/memleket/entities/dsm"
              target="_blank"
              rel="noopener"
              class="text-gray-400 hover:text-white transition-colors"
            >Мин. здравоохранения</a>
            <a
              href="https://www.gov.kz/memleket/entities/enbek"
              target="_blank"
              rel="noopener"
              class="text-gray-400 hover:text-white transition-colors"
            >Мин. труда</a>
            <a
              href="https://www.gov.kz/memleket/entities/emer"
              target="_blank"
              rel="noopener"
              class="text-gray-400 hover:text-white transition-colors"
            >МЧС РК</a>
          </div>
          <div class="flex items-center gap-3 text-gray-400 sm:ml-auto">
            <UIcon
              name="i-lucide-phone"
              class="size-3"
            />
            <a
              href="tel:+77777731238"
              class="hover:text-white transition-colors"
            >+7 (777) 773-12-38</a>
            <span class="text-gray-600">/</span>
            <a
              href="tel:+77753528232"
              class="hover:text-white transition-colors"
            >+7 (775) 352-82-32</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5"
          >
            <UIcon
              name="i-lucide-graduation-cap"
              class="size-7 text-primary"
            />
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
            <UButton
              to="/about"
              label="О компании"
              variant="ghost"
              color="primary"
              size="sm"
              class="font-semibold"
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
      <section class="relative py-16 sm:py-24 overflow-hidden">
        <img
          src="/ala_skyline.jpg"
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-kazblue-950/60" />
        <div class="absolute inset-0 bg-linear-to-b from-kazblue-900/30 to-kazblue-950/70" />
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            О компании
          </h1>
          <p class="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
            Квалификационная Комиссия Республики Казахстан
          </p>
        </div>
      </section>

      <!-- About Main -->
      <section class="py-16 sm:py-24">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-5 gap-10 items-start">
            <!-- Director card -->
            <div class="md:col-span-2">
              <div class="sticky top-24 space-y-6">
                <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div class="flex flex-col items-center text-center">
                    <img
                      src="/ermek.jpg"
                      alt="Курмансеитов Ермек"
                      class="w-full aspect-[3/4] object-cover"
                    >
                    <div class="p-6">
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                        Курмансеитов Ермек
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Председатель Квалификационной Комиссии
                      </p>
                    </div>
                  </div>

                  <div class="px-6 pb-6">
                    <USeparator class="mb-5" />

                    <div class="space-y-3 text-sm">
                      <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <UIcon
                          name="i-lucide-map-pin"
                          class="size-4 text-primary shrink-0"
                        />
                        <span>г. Алматы, пр. Абая, 151/115</span>
                      </div>
                      <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <UIcon
                          name="i-lucide-phone"
                          class="size-4 text-primary shrink-0"
                        />
                        <div class="flex flex-col">
                          <a
                            href="tel:+77777731238"
                            class="hover:text-primary transition-colors"
                          >+7 (777) 773-12-38</a>
                          <a
                            href="tel:+77753528232"
                            class="hover:text-primary transition-colors"
                          >+7 (775) 352-82-32</a>
                        </div>
                      </div>
                      <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <UIcon
                          name="i-lucide-mail"
                          class="size-4 text-primary shrink-0"
                        />
                        <a
                          href="mailto:kazintake@kazintake.kz"
                          class="hover:text-primary transition-colors"
                        >kazintake@kazintake.kz</a>
                      </div>
                    </div>
                  </div>
                </div>

                <UButton
                  to="tel:+77777731238"
                  label="Связаться с нами"
                  icon="i-lucide-phone"
                  size="lg"
                  block
                />
              </div>
            </div>

            <!-- Info -->
            <div class="md:col-span-3 space-y-8">
              <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Квалификационная Комиссия
                </h2>
                <div class="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    <strong>Квалификационная Комиссия</strong> — предоставляет услуги, связанные
                    с обеспечением безопасности и охраны труда, пожарной безопасности, гигиенического обучения,
                    противодействия терроризму, а также согласительной комиссии в организациях Республики Казахстан.
                  </p>
                  <p>
                    Квалификационная Комиссия осуществляет свою деятельность в соответствии с законами Республики Казахстан, иными нормативными правовыми актами, Регламентом Квалификационной Комиссии, а также Уставом.
                  </p>
                  <p>
                    Мы обеспечиваем полный цикл корпоративного обучения — от разработки учебных программ до аттестации сотрудников и выдачи документов государственного образца.
                  </p>
                </div>
              </div>

              <USeparator />

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-6">
                <div class="p-5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                  <p class="text-3xl font-extrabold text-primary">
                    8+
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Программ обучения
                  </p>
                </div>
                <div class="p-5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                  <p class="text-3xl font-extrabold text-primary">
                    1000+
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Обученных специалистов
                  </p>
                </div>
                <div class="p-5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                  <p class="text-3xl font-extrabold text-primary">
                    100%
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Сертификация гос. образца
                  </p>
                </div>
                <div class="p-5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                  <p class="text-3xl font-extrabold text-primary">
                    24/7
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Доступ к платформе
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <p class="text-sm font-semibold text-primary mb-2">
              Наши принципы
            </p>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Почему выбирают нас
            </h2>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <div
              v-for="value in values"
              :key="value.title"
              class="p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <UIcon
                  :name="value.icon"
                  class="size-5 text-primary"
                />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                {{ value.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ value.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Timeline -->
      <section class="py-16 sm:py-24">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <p class="text-sm font-semibold text-primary mb-2">
              Наш путь
            </p>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Этапы развития
            </h2>
          </div>

          <div class="relative">
            <!-- Vertical line -->
            <div class="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

            <div class="space-y-8">
              <div
                v-for="milestone in milestones"
                :key="milestone.year"
                class="relative flex items-start gap-6 pl-12"
              >
                <div class="absolute left-0 size-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {{ milestone.year.slice(2) }}
                </div>
                <div class="pt-1.5">
                  <p class="text-sm font-semibold text-primary">
                    {{ milestone.year }}
                  </p>
                  <p class="text-gray-700 dark:text-gray-300 mt-0.5">
                    {{ milestone.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 text-center">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent)]" />
            <div class="relative">
              <h2 class="text-3xl sm:text-4xl font-bold text-white">
                Начните сотрудничество
              </h2>
              <p class="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                Свяжитесь с нами для организации обучения сотрудников вашей организации.
              </p>
              <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <UButton
                  to="tel:+77777731238"
                  label="+7 (777) 773-12-38"
                  icon="i-lucide-phone"
                  size="xl"
                  color="neutral"
                  variant="solid"
                  class="light"
                />
                <UButton
                  to="mailto:kazintake@kazintake.kz"
                  label="kazintake@kazintake.kz"
                  icon="i-lucide-mail"
                  size="xl"
                  variant="outline"
                  class="text-white border-white/30 hover:bg-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </UMain>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <UIcon
                name="i-lucide-graduation-cap"
                class="size-5 text-primary"
              />
              <span class="font-bold">Квалификационная Комиссия</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Квалификационная Комиссия, предоставляющая услуги по обеспечению безопасности и охраны труда в организациях Республики Казахстан.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Гос. ресурсы
            </h4>
            <div class="space-y-2 text-sm">
              <a
                href="https://egov.kz"
                target="_blank"
                rel="noopener"
                class="block text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >eGov.kz</a>
              <a
                href="https://www.gov.kz/memleket/entities/edu"
                target="_blank"
                rel="noopener"
                class="block text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >Министерство просвещения РК</a>
              <a
                href="https://www.gov.kz/memleket/entities/dsm"
                target="_blank"
                rel="noopener"
                class="block text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >Министерство здравоохранения РК</a>
              <a
                href="https://www.gov.kz/memleket/entities/enbek"
                target="_blank"
                rel="noopener"
                class="block text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >Министерство труда и соцзащиты РК</a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-sm text-gray-900 dark:text-white mb-3">
              Лицензии и права
            </h4>
            <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Деятельность осуществляется в соответствии с законодательством РК</p>
              <p>Сертификаты и удостоверения государственного образца</p>
            </div>
          </div>
        </div>
        <USeparator />
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p class="text-xs text-gray-400 dark:text-gray-500">
            &copy; {{ new Date().getFullYear() }} Квалификационная Комиссия. Все права защищены.
          </p>
          <div class="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span>ИИН/БИН организации</span>
            <UColorModeButton size="xs" />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
