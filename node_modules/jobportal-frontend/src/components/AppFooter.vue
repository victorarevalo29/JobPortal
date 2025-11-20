<template>
  <footer class="app-footer">
    <div>
      <p>JobPortal · Experimentos con talento emergente</p>
      <small>Construido con Vue 3 · Vite · Pinia</small>
    </div>
    <div class="app-footer__links">
      <RouterLink to="/jobs">Vacantes</RouterLink>
      <RouterLink to="/resources">Recursos</RouterLink>
      <RouterLink to="/forum">Foros</RouterLink>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.app-footer {
  margin-top: 4rem;
  padding: 2.5rem 0 1.5rem;
  border-top: 1px solid rgba(37, 99, 235, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  color: var(--clr-muted);
  font-size: 0.95rem;
}

.app-footer p {
  margin: 0;
  font-weight: 600;
}

.app-footer__links {
  display: flex;
  gap: 1.5rem;
  font-weight: 600;
}

.app-footer__links a {
  color: var(--clr-primary);
}
</style>
