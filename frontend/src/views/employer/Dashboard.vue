<template>
  <section class="employer-dashboard">
    <header class="employer-dashboard__hero">
      <div>
        <p class="section-kicker">Panel empresarial</p>
        <h1>Diseña cohorts, publica roles y monitorea talento.</h1>
        <p>Un solo panel para medir vacantes, postulaciones y la calidad de los perfiles recibidos.</p>
      </div>
      <div class="employer-dashboard__actions">
        <BaseButton size="sm" @click="goToManageJobs">Publicar empleo</BaseButton>
        <RouterLink class="ghost-link" to="/employer/applicants">Ver postulaciones</RouterLink>
      </div>
    </header>

    <section class="employer-dashboard__stats">
      <article class="stat-card" v-for="stat in stats" :key="stat.label">
        <p class="stat-card__label">{{ stat.label }}</p>
        <p class="stat-card__value">{{ stat.value }}</p>
        <p class="stat-card__sub">{{ stat.subtext }}</p>
      </article>
    </section>

    <section class="employer-dashboard__grid">
      <BaseCard class="employer-dashboard__jobs-card">
        <template #title>Vacantes activas</template>
        <p class="muted">Filtramos automáticamente por la organización logueada.</p>
        <div class="vacancy-cards">
          <article v-for="job in employerJobs" :key="job.id" class="vacancy-card">
            <div class="vacancy-card__head">
              <span class="pill">{{ job.modality || 'Flexible' }}</span>
              <span class="vacancy-card__date">{{ getJobPublishedLabel(job) }}</span>
            </div>
            <h3>{{ job.title }}</h3>
            <p class="vacancy-card__location">{{ job.location || 'Ubicación por definir' }}</p>
            <p class="vacancy-card__contract">{{ job.contractType || job.category || 'Contrato abierto' }}</p>
            <p class="vacancy-card__summary">{{ job.description || 'Comparte contexto de la vacante para recibir mejores matches.' }}</p>
            <div class="vacancy-card__footer">
              <div>
                <p class="eyebrow">Postulaciones</p>
                <strong>{{ jobApplicationsMap[job.id] || 0 }}</strong>
              </div>
              <div class="vacancy-card__actions">
                <BaseButton size="sm" variant="ghost" @click="goToApplicants(job.id)">Ver postulantes</BaseButton>
                <button class="link-button" type="button" @click="goToManageJobs">Editar</button>
              </div>
            </div>
          </article>
          <p v-if="!employerJobs.length" class="vacancy-card__empty">
            Aún no hay vacantes asociadas a tu empresa. Publica una nueva para comenzar a recibir perfiles.
          </p>
        </div>
      </BaseCard>

      <BaseCard>
        <template #title>Postulaciones recientes</template>
        <ul class="applicant-list">
          <li v-for="application in latestApplications" :key="application.id">
            <div>
              <strong>{{ application.candidate }}</strong>
              <p>{{ application.role }}</p>
            </div>
            <span>{{ application.status }}</span>
          </li>
          <li v-if="!latestApplications.length" class="applicant-list__empty">
            <p>Sin postulaciones recientes para estas vacantes.</p>
          </li>
        </ul>
        <template #footer>
          <RouterLink to="/employer/applicants">Abrir módulo de postulaciones →</RouterLink>
        </template>
      </BaseCard>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useAuthStore } from '@/stores/authStore'
import { useJobsStore } from '@/stores/jobsStore'

const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const companyLookup = {
  rafaga: 'Ráfaga Mobility Lab',
  selva: 'Selva Cloud Cartography',
  matiz: 'Matiz Learning Lab',
  pulsar: 'Pulsar Analytics Coop',
  nebula: 'Nebula Labs',
  indiehr: 'IndieHR',
  costadev: 'Costa Dev Commons',
  bruma: 'Bruma XR Forge',
  faro: 'Faro Civic Systems'
}

const employerCompanyName = computed(() => {
  if (authStore.user?.company?.name) return authStore.user.company.name
  if (authStore.user?.companyName) return authStore.user.companyName
  const domain = authStore.user?.email?.split('@')[1]?.split('.')[0]
  return domain ? companyLookup[domain] || '' : ''
})

const normalize = (value = '') => value.toString().toLowerCase()

const jobDateValue = (job) => {
  const source = job.createdAt || job.updatedAt || job.publishedAt
  const parsed = source ? Date.parse(source) : NaN
  if (!Number.isNaN(parsed)) return parsed
  const match = typeof source === 'string' ? source.match(/(\d+)/) : null
  if (match) {
    const daysAgo = Number(match[1])
    if (Number.isFinite(daysAgo)) {
      return Date.now() - daysAgo * 24 * 60 * 60 * 1000
    }
  }
  return 0
}

const employerJobs = computed(() => {
  const jobs = jobsStore.jobs || []
  if (!jobs.length) return []
  const company = normalize(employerCompanyName.value)
  const filtered = company
    ? jobs.filter((job) => {
        const candidateA = normalize(job.company?.name || job.company)
        return candidateA.includes(company)
      })
    : jobs

  const source = filtered.length ? filtered : jobs
  return [...source].sort((a, b) => jobDateValue(b) - jobDateValue(a))
})

const jobApplicationsMap = computed(() => {
  return (jobsStore.applications || []).reduce((acc, application) => {
    const key = application.jobId
    if (key) {
      acc[key] = (acc[key] || 0) + 1
    }
    return acc
  }, {})
})

const totalApplications = computed(() =>
  employerJobs.value.reduce((acc, job) => acc + (jobApplicationsMap.value[job.id] || 0), 0)
)

const stats = computed(() => [
  {
    label: 'Vacantes activas',
    value: employerJobs.value.length.toString().padStart(2, '0'),
    subtext: employerCompanyName.value ? `Para ${employerCompanyName.value}` : 'Con filtros personalizados'
  },
  {
    label: 'Postulaciones recibidas',
    value: totalApplications.value.toString().padStart(2, '0'),
    subtext: 'Sumatoria de tus vacantes'
  },
  {
    label: 'Tiempo a contratar',
    value: '18 días',
    subtext: 'Promedio JobPortal'
  }
])

const latestApplications = computed(() => {
  const jobIds = new Set(employerJobs.value.map((job) => job.id))
  return (jobsStore.applications || [])
    .filter((application) => jobIds.has(application.jobId))
    .slice(0, 5)
})

const goToManageJobs = () => {
  router.push('/employer/jobs')
}

const goToApplicants = (jobId) => {
  router.push({ name: 'employer-applicants', query: { job: jobId } })
}

const getJobPublishedLabel = (job) => {
  const source = job.publishedAt || job.postedAgo
  const parsed = source ? Date.parse(source) : NaN
  if (!Number.isNaN(parsed)) {
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(parsed)
  }
  return source || 'Recién publicado'
}

onMounted(async () => {
  if (!jobsStore.jobs.length) {
    await jobsStore.fetchJobs()
  }
  if (!jobsStore.applications.length) {
    await jobsStore.fetchApplications()
  }
})
</script>

<style scoped>
.employer-dashboard {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.employer-dashboard__hero {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.employer-dashboard__actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.ghost-link {
  color: var(--clr-primary);
  font-weight: 600;
}

.employer-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(236, 244, 255, 0.9));
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.stat-card__label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: var(--clr-muted);
}

.stat-card__value {
  font-size: 2.4rem;
  margin: 0.3rem 0;
  font-family: var(--font-heading);
}

.employer-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.muted {
  color: var(--clr-muted);
}

.applicant-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.applicant-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.applicant-list p {
  margin: 0;
  color: var(--clr-muted);
}

.applicant-list__empty {
  justify-content: center;
  color: var(--clr-muted);
}

.employer-dashboard__jobs-card .muted {
  margin-top: -0.5rem;
  color: var(--clr-muted);
}

.vacancy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.vacancy-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.98), rgba(236, 244, 255, 0.92));
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  box-shadow: var(--shadow-soft);
}

.vacancy-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.vacancy-card__date {
  color: var(--clr-muted);
  font-size: 0.9rem;
}

.vacancy-card__location {
  margin: 0;
  font-weight: 600;
}

.vacancy-card__contract,
.vacancy-card__summary {
  margin: 0;
  color: var(--clr-muted);
}

.vacancy-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.vacancy-card__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.vacancy-card__empty {
  grid-column: 1 / -1;
  padding: 1rem;
  color: var(--clr-muted);
}

.pill {
  padding: 0.25rem 0.9rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: var(--clr-primary);
  font-weight: 600;
}
</style>
