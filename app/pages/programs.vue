<script setup lang="ts">
definePageMeta({ layout: false })

const programs = [
  {
    id: 'ptm',
    icon: 'i-lucide-flame',
    title: 'ПТМ',
    subtitle: 'Пожарно-технический минимум',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
    description: 'Обучение и проверка знаний по вопросам пожарной безопасности. По завершению выдается удостоверение государственного образца.',
    details: [
      'По данным Комитета по правовой статистике и специальным учетам Генеральной прокуратуры РК за период 2015–2020 гг. зарегистрировано 724 фактов нарушения пожарной безопасности по ст. 292 УК РК.',
      'В соответствии с п.1-2 Постановления Правительства РК от 09.10.2014 г. № 1077 пожарная безопасность на объекте обеспечивается собственниками объектов, руководителями организаций, предприятий, независимо от форм собственности, а также индивидуальными предпринимателями.',
      'Из п. 26 Приказа МЧС РК от 09.06.2014г. №276 следует, что руководители, специалисты и работники организаций, независимо от направления деятельности, в течение месяца после приема на работу должны пройти обучение и проверку знаний по вопросам ПТМ, с последующей периодичностью не реже одного раза в три года.',
      'Не прошедшие лица до повторной проверки к самостоятельной работе не допускаются (п. 36 Приказа).',
      'Обучение и наличие удостоверения является необходимым и учитывается при проведении проверок гос. органами. За нарушение предусмотрена ответственность согласно КоАП и УК РК.'
    ],
    goals: [
      'Требования актуальных нормативных документов в сфере пожарной безопасности',
      'Детальное изучение производственного процесса на предприятии с точки зрения риска пожарной опасности',
      'Навыки практического поведения в случае пожара, включая правила оказания первой помощи пострадавшим от огня или дыма',
      'Приемы и методы, обеспечивающие эффективную профилактику возгораний'
    ],
    document: 'Удостоверение государственного образца'
  },
  {
    id: 'biot',
    icon: 'i-lucide-hard-hat',
    title: 'БиОТ',
    subtitle: 'Безопасность и охрана труда',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    description: 'Обучение руководителей и работников по вопросам безопасности и охраны труда. По завершению выдается сертификат государственного образца.',
    details: [
      'Ежегодно более 1,5 тыс. работников получают травмы на производстве и порядка 250 человек погибают.',
      'По итогам 9 месяцев 2020 года результаты государственного контроля показывают, что порядка 26,4% выявленных нарушений приходится на область безопасности и охраны труда: необеспечение безопасных условий труда (306 или 25,7%); не проведение обучения работников безопасности труда (157 или 13,2%).',
      'В соответствии с п. 19, ст. 23 Трудового Кодекса РК работодатель обязан принимать меры по предотвращению рисков на рабочих местах и в технологических процессах.',
      'Из п. 21 Приказа МЗиСР РК от 25.12.2015г. №1019 следует, что руководящие работники и ответственные за обеспечение БиОТ периодически, не реже одного раза в три года проходят обучение и проверку знаний.',
      'Руководящий и ответственный работник, не прошедший проверку знаний, отстраняется от работы. За нарушение предусмотрена ответственность согласно КоАП и УК РК.'
    ],
    goals: [
      'Сокращение риска получения травм работниками в ходе выполнения профессиональных обязанностей',
      'Снижение вероятности появления профессиональных заболеваний у сотрудников, постоянно работающих во вредных условиях',
      'Предупреждение возникновения аварийных и нештатных ситуаций'
    ],
    document: 'Сертификат государственного образца'
  },
  {
    id: 'sez',
    icon: 'i-lucide-shield-check',
    title: 'СЭЗ',
    subtitle: 'Санитарно-эпидемиологическая защищённость',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    description: 'Гигиеническое обучение лиц декретированной группы населения. Профилактические мероприятия для организаций.',
    details: [
      'В соответствии с п. 19, ст. 23 ТК РК работодатель обязан принимать меры по предотвращению рисков на рабочих местах и в технологических процессах, проводить профилактические работы.',
      'Согласно Приказу МЗ РК от 16.11.2020г. № ҚР ДСМ-195/2020 лица, работающие в сфере обслуживания населения и представляющие наибольшую опасность для заражения окружающих людей инфекционными и паразитарными заболеваниями подлежат обязательному первичному гигиеническому обучению при поступлении на работу.',
      'Оплата за гигиеническое обучение осуществляется декретированными лицами самостоятельно либо работодателем.',
      'Отсутствие профилактических и учебных мероприятий является грубым нарушением и учитывается при проведении проверок государственными контрольными органами.',
      'В соответствии со ст. 425 КоАП РК нарушение требований законодательства в области санитарно-эпидемиологического благополучия населения влечёт штраф от 30 до 2000 МРП, с приостановлением деятельности либо без такового.'
    ],
    goals: [
      'Повышение эффективности лечебно-профилактических мероприятий путём улучшения уровня знаний и привития необходимых умений и навыков'
    ],
    document: 'Сертификат о прохождении гигиенического обучения'
  },
  {
    id: 'antiterror',
    icon: 'i-lucide-siren',
    title: 'Антитеррор',
    subtitle: 'Антитеррористическая защита',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'Профилактические и учебные мероприятия для персонала по обеспечению антитеррористической защищённости объектов.',
    details: [
      'По сведениям Спикера Мажилиса РК свыше 3500 социальных объектов в Казахстане не защищены от террористических атак.',
      'В соответствии со ст. 10-3 Закона РК «О противодействии терроризму» собственники, владельцы, руководители объектов, уязвимых в террористическом отношении, обязаны предусмотреть финансирование и реализовывать мероприятия по организации профилактических и учебных мероприятий с персоналом.',
      'Проведение профилактических и учебных мероприятий является необходимым и учитывается при проведении проверок государственными контрольными органами.',
      'Неисполнение обязанностей по обеспечению антитеррористической защиты влечёт штраф от 100 до 1000 МРП с приостановлением деятельности на срок до трёх месяцев (ст. 149 КоАП РК).'
    ],
    goals: [
      'Обеспечение и защита прав и свобод человека и гражданина',
      'Приоритет защиты жизни и здоровья лиц, подвергающихся опасности в результате террористических преступлений'
    ],
    document: 'Сертификат о прохождении обучения'
  },
  {
    id: 'paramedic',
    icon: 'i-lucide-heart-pulse',
    title: 'Парамедика',
    subtitle: 'Первая доврачебная медицинская помощь',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-pink-200 dark:border-pink-800',
    description: 'Обучение работников и специалистов основным способам и методам оказания первой доврачебной помощи.',
    details: [
      'В соответствии с п. 19, ст. 23 Трудового Кодекса РК работодатель обязан принимать меры по предотвращению рисков на рабочих местах.',
      'Из пп. 1, п. 1, ст. 187 Кодекса следует, что работодатель обязан организовать оказание первой медицинской помощи пострадавшему и при необходимости его доставку в организацию здравоохранения.',
      'Первая помощь — комплекс срочных базовых мероприятий для спасения жизни человека и предупреждения осложнений при экстренных состояниях, проводимых на месте происшествия (ст. 38-1 Кодекса РК «О здоровье народа и системе здравоохранения»).',
      'Согласно Приказу МОН РК от 14 марта 2020 года № 108, руководителям организаций образования необходимо принять меры по усилению санитарно-эпидемиологических и профилактических мероприятий.'
    ],
    goals: [
      'Обучение работников и специалистов основным способам и методам оказания первой доврачебной помощи'
    ],
    document: 'Сертификат о прохождении обучения'
  },
  {
    id: 'commission',
    icon: 'i-lucide-handshake',
    title: 'Согласительная комиссия',
    subtitle: 'Трудовые споры и законодательство',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    description: 'Учебные мероприятия для руководителей и членов согласительных комиссий. Выдаётся сертификат установленного образца.',
    details: [
      'С принятием нового Трудового кодекса РК порядок разрешения трудовых споров существенно изменился. Обязательным этапом стало рассмотрение разногласий согласительной комиссией.',
      'Согласительная комиссия является постоянно действующим органом, создаваемым в организации на паритетных началах из равного числа представителей от работодателя и работников (п. 2, ст. 159 Кодекса).',
      'Обязанность по созданию согласительной комиссии возложена на работодателя (пп. 26, п. 2, ст. 23 Кодекса).',
      'В соответствии с п. 8, ст. 159 Трудового кодекса члены согласительной комиссии обязаны проходить ежегодное обучение по применению трудового законодательства РК.',
      'Несоблюдение требований по работе согласительных комиссий относится к значительным нарушениям.'
    ],
    goals: [
      'Рассмотрение возможных индивидуальных трудовых споров и оптимальные пути их разрешения',
      'Ознакомление с нормативной правовой базой',
      'Ознакомление с изменениями в Трудовом законодательстве'
    ],
    document: 'Сертификат установленного образца и методические пособия'
  },
  {
    id: 'anticorruption',
    icon: 'i-lucide-scale',
    title: 'Антикоррупция',
    subtitle: 'Противодействие коррупции',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    description: 'Повышение правовой грамотности в сфере антикоррупционного законодательства и организации комплаенса.',
    details: [
      'Являясь неотъемлемой частью развития общественных отношений, коррупция рассматривается как негативное явление, угрожающее политической стабильности, национальной безопасности, экономическому развитию страны.',
      'Борьба с коррупцией является одним из ключевых направлений Республики Казахстан.',
      'Руководитель организации является ответственным за организацию всех мероприятий, направленных на предупреждение коррупции.'
    ],
    goals: [
      'Исполнение требований и повышение правовой грамотности в сфере антикоррупционного законодательства',
      'Антикоррупционный стандарт поведения',
      'Организация института антикоррупционного комплаенса'
    ],
    document: 'Сертификат о прохождении обучения'
  },
  {
    id: 'bullying',
    icon: 'i-lucide-message-circle-warning',
    title: 'Буллинг',
    subtitle: 'Буллинг / Кибербуллинг',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    description: 'Профилактика и противодействие буллингу и кибербуллингу в организациях и учебных заведениях.',
    details: [
      'Буллинг и кибербуллинг являются серьёзными социальными проблемами, требующими комплексного подхода к их предотвращению.',
      'Проведение профилактических и учебных мероприятий направлено на создание безопасной среды в организациях и учебных заведениях.'
    ],
    goals: [
      'Профилактика и противодействие буллингу и кибербуллингу',
      'Создание безопасной среды в организациях и учебных заведениях'
    ],
    document: 'Сертификат о прохождении обучения'
  }
]

const expandedProgram = ref<string | null>(null)

function toggleProgram(id: string) {
  expandedProgram.value = expandedProgram.value === id ? null : id
}

const navLinks = [
  { label: 'Главная', to: '/' },
  { label: 'О компании', to: '/about' },
  { label: 'Контакты', to: '/#contacts' }
]
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
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
              to="/programs"
              label="Программы"
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
        <div class="absolute inset-0 bg-black/40" />
        <div class="absolute inset-0 bg-linear-to-b from-black/20 to-black/50" />
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Программы обучения
          </h1>
          <p class="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
            Полный спектр образовательных программ для обеспечения соответствия
            требованиям законодательства Республики Казахстан.
          </p>
        </div>
      </section>

      <!-- Programs List -->
      <section class="py-16 sm:py-24">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="space-y-6">
            <div
              v-for="program in programs"
              :key="program.id"
              class="border rounded-2xl overflow-hidden transition-all duration-300"
              :class="[
                program.borderColor,
                expandedProgram === program.id ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
              ]"
            >
              <!-- Card Header -->
              <button
                class="w-full text-left px-6 py-5 flex items-center gap-4 cursor-pointer"
                :class="program.bgColor"
                @click="toggleProgram(program.id)"
              >
                <div class="size-12 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-gray-900 shadow-sm">
                  <UIcon
                    :name="program.icon"
                    class="size-6"
                    :class="program.color"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ program.title }}
                    </h2>
                    <UBadge
                      variant="subtle"
                      size="xs"
                    >
                      {{ program.subtitle }}
                    </UBadge>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {{ program.description }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="size-5 text-gray-400 shrink-0 transition-transform duration-300"
                  :class="{ 'rotate-180': expandedProgram === program.id }"
                />
              </button>

              <!-- Card Body -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[2000px] opacity-100"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="max-h-[2000px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div
                  v-if="expandedProgram === program.id"
                  class="overflow-hidden"
                >
                  <div class="px-6 pb-6 space-y-6 bg-white dark:bg-gray-950">
                    <!-- Description details -->
                    <div>
                      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Описание
                      </h3>
                      <div class="space-y-3">
                        <p
                          v-for="(detail, idx) in program.details"
                          :key="idx"
                          class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                        >
                          {{ detail }}
                        </p>
                      </div>
                    </div>

                    <USeparator />

                    <!-- Goals -->
                    <div>
                      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Цель обучения
                      </h3>
                      <ul class="space-y-2">
                        <li
                          v-for="(goal, idx) in program.goals"
                          :key="idx"
                          class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <UIcon
                            name="i-lucide-check-circle"
                            class="size-4 text-primary mt-0.5 shrink-0"
                          />
                          <span>{{ goal }}</span>
                        </li>
                      </ul>
                    </div>

                    <USeparator />

                    <!-- Document -->
                    <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <UIcon
                        name="i-lucide-file-badge"
                        class="size-5 text-primary shrink-0"
                      />
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          По завершению выдаётся:
                        </p>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white">
                          {{ program.document }}
                        </p>
                      </div>
                    </div>

                    <!-- CTA -->
                    <div class="flex flex-col sm:flex-row gap-3">
                      <UButton
                        to="tel:+77719292212"
                        label="Связаться"
                        icon="i-lucide-phone"
                        size="lg"
                      />
                      <UButton
                        to="/login"
                        label="Пройти обучение"
                        icon="i-lucide-play"
                        variant="outline"
                        color="neutral"
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              </Transition>
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
                Готовы начать обучение?
              </h2>
              <p class="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                Войдите в систему для прохождения курсов и получения сертификата государственного образца.
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
    </UMain>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-graduation-cap"
              class="size-5 text-primary"
            />
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
