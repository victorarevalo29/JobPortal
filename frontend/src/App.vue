<template>
  <div class="app-shell">
    <Navbar />
    <main class="app-shell__main">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 0 5vw 4rem;
  color: var(--clr-text);
  position: relative;
  overflow: hidden;
}

.app-shell__main {
  min-height: 70vh;
}
</style>
