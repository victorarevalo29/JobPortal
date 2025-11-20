<template>
  <section class="applications">
    <header class="applications__hero">
      <div>
        <p class="section-kicker">Seguimiento en tiempo real</p>
        <h2>Mis postulaciones</h2>
        <p>Revisa los roles donde ya aplicaste y monitorea cada actualización de estado.</p>
      </div>
      <div class="applications__hero-actions">
        <div class="applications__summary">
          <div>
            <small>Total</small>
            <strong>{{ totalApplications }}</strong>
          </div>
          <div>
            <small>En revisión</small>
            <strong>{{ reviewingApplications }}</strong>
          </div>
        </div>
        <BaseButton variant="ghost" size="sm" :is-loading="jobsStore.loading" @click="refreshApplications">
          Actualizar
        </BaseButton>
      </div>
    </header>

    <section class="applications__list">
      <BaseCard v-if="jobsStore.loading" class="applications__card applications__card--loading">
        <p>Cargando tus postulaciones…</p>
      </BaseCard>
      <BaseCard v-else-if="!applications.length" class="applications__card applications__card--empty">
        <template #title>Sin postulaciones activas</template>
        <p>Aún no aplicas a ningún rol. Descubre oportunidades y regresa aquí para monitorear tu progreso.</p>
        <BaseButton size="sm" @click="goToJobs">Buscar vacantes</BaseButton>
      </BaseCard>
      <ul v-else class="applications__grid">
        <li v-for="application in applications" :key="application.id">
          <BaseCard class="applications__card">
            <template #title>{{ application.role }}</template>
            <p class="applications__company">{{ application.jobCompany }}</p>
            <div class="applications__row">
              <span class="status-chip" :data-status="application.status">{{ application.statusLabel }}</span>
              <span class="applications__date">Enviada {{ formatDate(application.submittedAt) }}</span>
            </div>
            <p v-if="application.message" class="applications__message">“{{ application.message }}”</p>
            <p v-if="application.cvUrl" class="applications__cv">
              <button class="applications__cv-link" type="button" @click="openCv(application.cvUrl)">
                Descargar CV adjunto
              </button>
            </p>
            <div class="applications__actions">
              <BaseButton variant="ghost" size="sm" @click="goToJob(application.jobId)">Ver vacante</BaseButton>
            </div>
          </BaseCard>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useJobsStore } from '@/stores/jobsStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const applications = computed(() => jobsStore.applications)
const authUserId = computed(() => authStore.user?._id || authStore.user?.id)

const totalApplications = computed(() => applications.value.length)
const reviewingApplications = computed(() =>
  applications.value.filter((application) => ['in-review', 'interview'].includes(application.status)).length
)

const loadApplications = async () => {
  if (!authUserId.value) return
  await jobsStore.fetchApplications({ candidate: authUserId.value })
}

const refreshApplications = () => {
  loadApplications()
}

const goToJobs = () => router.push('/jobs')
const goToJob = (id) => router.push(`/jobs/${id}`)

const openCv = (url) => {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}

const formatDate = (value) => {
  if (!value) return 'recién'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'recién'
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

watch(authUserId, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    loadApplications()
  }
})

onMounted(() => {
  loadApplications()
})
</script>

<style scoped>
.applications {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.applications__hero {
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  background: var(--clr-surface);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: center;
}

.applications__hero h2 {
  margin: 0.35rem 0;
}

.applications__hero-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.applications__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(80px, 1fr));
  gap: 1rem;
  text-align: right;
}

.applications__summary small {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--clr-muted);
}

.applications__summary strong {
  font-size: 1.5rem;
}

.applications__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.applications__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.applications__card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.applications__card--loading,
.applications__card--empty {
  text-align: center;
  align-items: center;
  justify-content: center;
}

.applications__company {
  margin: 0;
  font-weight: 600;
  color: var(--clr-muted);
}

.applications__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.status-chip {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.16);
  color: var(--clr-primary);
}

.status-chip[data-status='interview'] {
  background: rgba(249, 115, 22, 0.16);
  color: #ea580c;
}

.status-chip[data-status='offer'] {
  background: rgba(34, 197, 94, 0.18);
  color: #15803d;
}

.status-chip[data-status='rejected'] {
  background: rgba(239, 68, 68, 0.18);
  color: #b91c1c;
}

.applications__date {
  font-size: 0.9rem;
  color: var(--clr-muted);
}

.applications__message {
  margin: 0;
  font-style: italic;
  color: var(--clr-text);
}

.applications__cv {
  margin: 0;
}

.applications__cv-link {
  border: none;
  background: none;
  padding: 0;
  font-weight: 600;
  color: var(--clr-primary);
  cursor: pointer;
}

.applications__actions {
  margin-top: auto;
}

@media (max-width: 640px) {
  .applications__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .applications__hero-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
