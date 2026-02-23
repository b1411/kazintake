<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'ru'
  }
})

const title = 'KAZINTAKE&SERVICE — Квалификационная Комиссия'
const description = 'Квалификационная Комиссия, предоставляющая услуги по обеспечению безопасности и охраны труда, пожарной безопасности, гигиенического обучения в организациях Республики Казахстан.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
