<template>
  <nav class="navbar">
    <RouterLink class="navbar__logo" to="/">
      <span>JobPortal</span>
      <small>Release 4.2</small>
    </RouterLink>

    <div class="navbar__status">
      <span class="navbar__dot" aria-hidden="true" />
      <span>Infra estable</span>
    </div>

    <button class="navbar__toggle" @click="isOpen = !isOpen" aria-label="Abrir navegación">
      <span />
      <span />
    </button>

    <ul :class="['navbar__links', { 'navbar__links--open': isOpen }]">
      <li v-for="link in links" :key="link.label">
        <RouterLink :to="link.to" @click="isOpen = false">{{ link.label }}</RouterLink>
      </li>
    </ul>

    <div class="navbar__actions">
      <template v-if="isAuthenticated">
        <BaseButton variant="ghost" size="sm" @click="goToDashboard">Dashboard</BaseButton>
        <BaseButton size="sm" @click="logout">Cerrar sesión</BaseButton>
      </template>
      <template v-else>
        <BaseButton variant="ghost" size="sm" @click="goToLogin">Iniciar sesión</BaseButton>
        <BaseButton size="sm" @click="goToRegister">Crear cuenta</BaseButton>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'

const isOpen = ref(false)
const router = useRouter()

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const links = [
  { label: 'Blueprint', to: { path: '/', hash: '#metodologia' } },
  { label: 'Insights', to: { path: '/', hash: '#soporte' } },
  { label: 'Métricas', to: { path: '/', hash: '#metricas' } },
  { label: 'Vacantes', to: { path: '/', hash: '#vacantes' } }
]

const goToLogin = () => {
  router.push('/login')
  isOpen.value = false
}

const goToRegister = () => {
  router.push('/register')
  isOpen.value = false
}

const goToDashboard = () => {
  router.push('/dashboard')
  isOpen.value = false
}

const logout = async () => {
  await authStore.logout()
  router.push('/')
  isOpen.value = false
}
</script>

<style scoped>
.navbar {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0;
  position: sticky;
  top: 0;
  background: rgba(233, 241, 255, 0.92);
  border-bottom: 1px solid rgba(37, 99, 235, 0.16);
  backdrop-filter: blur(18px);
  z-index: 20;
}

.navbar__logo {
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  font-family: var(--font-heading);
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.navbar__logo small {
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--clr-muted);
}

.navbar__status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: var(--clr-primary);
  font-weight: 600;
  font-size: 0.85rem;
}

.navbar__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
}

.navbar__links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  justify-self: center;
}

.navbar__links a {
  color: var(--clr-muted);
  font-weight: 600;
  letter-spacing: 0.03em;
  position: relative;
}

.navbar__links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.4rem;
  width: 100%;
  height: 2px;
  background: var(--clr-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.navbar__links a.router-link-active,
.navbar__links a:hover {
  color: var(--clr-text);
}

.navbar__links a.router-link-active::after,
.navbar__links a:hover::after {
  transform: scaleX(1);
}

.navbar__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.navbar__toggle {
  display: none;
  flex-direction: column;
  gap: 0.35rem;
  border: 1px solid rgba(15, 23, 42, 0.2);
  border-radius: 999px;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.navbar__toggle span {
  width: 22px;
  height: 2px;
  background: var(--clr-text);
}

@media (max-width: 960px) {
  .navbar {
    grid-template-columns: auto 1fr auto;
  }

  .navbar__status {
    display: none;
  }
}

@media (max-width: 820px) {
  .navbar__links {
    position: absolute;
    top: 74px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(236, 242, 255, 0.97);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    transform: scaleY(0);
    transform-origin: top;
    transition: transform var(--transition-base);
    border: 1px solid rgba(37, 99, 235, 0.15);
    gap: 1rem;
  }

  .navbar__links--open {
    transform: scaleY(1);
  }

  .navbar__toggle {
    display: flex;
  }

  .navbar__actions {
    display: none;
  }
}
</style>
