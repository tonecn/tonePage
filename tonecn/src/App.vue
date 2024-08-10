<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderVue from '@/components/Common/Header.vue'
import FooterVue from '@/components/Common/Footer.vue'
</script>

<template>
  <header>
    <HeaderVue />
  </header>
  <main>
    <RouterView />
    <FooterVue />
  </main>
</template>
