<template>
  <section class="auth auth--login">
    <div class="auth__surface">
      <div class="auth__brand">
        <span class="auth__pill">JobPortal</span>
        <h2>Activa tu panel personalizado y mantén tu pipeline al día.</h2>
        <p>Administra vacantes, foros y recursos desde un solo lugar con métricas claras.</p>
      </div>
      <BaseCard variant="glass" class="auth__card">
        <div class="auth__header">
          <p class="auth__eyebrow">Bienvenido de vuelta</p>
          <h1>Inicia sesión</h1>
          <p class="auth__hint">Accede al panel, guarda vacantes y continúa donde te quedaste.</p>
        </div>

        <form class="auth__form" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="form.email"
            type="email"
            label="Correo institucional"
            placeholder="tusitio@uni.edu"
          />
          <BaseInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
          />
          <p v-if="errorMessage" class="auth__error">{{ errorMessage }}</p>
          <BaseButton type="submit" size="lg" :is-loading="authStore.loading">Iniciar sesión</BaseButton>
        </form>

        <p class="auth__alt">
          ¿No tienes cuenta?
          <button type="button" class="auth__link" @click="goToRegister">Crear cuenta</button>
        </p>
      </BaseCard>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')

const validate = () => {
  if (!form.email || !form.password) {
    errorMessage.value = 'Completa tu correo y contraseña'
    return false
  }
  errorMessage.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validate()) return
  try {
    await authStore.login(form)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (error) {
    errorMessage.value = error.message || 'No pudimos validar tus datos'
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.auth {
  min-height: calc(100vh - 120px);
  padding: 3rem 1.5rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, rgba(37, 99, 235, 0.15), transparent 55%),
    radial-gradient(circle at bottom, rgba(14, 165, 233, 0.15), transparent 60%), #f5f7fb;
}

.auth__surface {
  width: min(100%, 1040px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  align-items: stretch;
}

.auth__brand {
  background: linear-gradient(135deg, #0f172a, #1d3c9b);
  border-radius: var(--radius-xl);
  padding: 3rem;
  color: #f8fafc;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
}

.auth__brand h2 {
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
  margin: 1rem 0 0.75rem;
}

.auth__brand p {
  color: rgba(248, 250, 252, 0.85);
  max-width: 42ch;
}

.auth__pill {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(248, 250, 252, 0.4);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.auth__card {
  width: min(440px, 100%);
  padding: 2.75rem;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(16px);
}

.auth__header {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.auth__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.72rem;
  color: #2563eb;
}

.auth__hint {
  color: #475569;
  margin: 0;
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  margin-top: 2rem;
}

.auth__error {
  color: #dc2626;
  font-size: 0.92rem;
  margin: 0;
}

.auth__alt {
  margin-top: 1.75rem;
  text-align: center;
  color: #475569;
}

.auth__link {
  border: none;
  background: none;
  color: #1d4ed8;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

@media (max-width: 960px) {
  .auth__surface {
    grid-template-columns: 1fr;
  }

  .auth__brand {
    order: 2;
    padding: 2.5rem;
  }
}
</style>
