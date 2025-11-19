<template>
  <section class="jobs">
    <header class="jobs__hero">
      <div>
        <p class="section-kicker">Curador inteligente</p>
        <h2>Encuentra el próximo reto con filtros avanzados.</h2>
        <p>
          Explora vacantes remotas, híbridas y presenciales. Ordena por habilidades, ciudades y seniority para construir
          cohorts hiper relevantes.
        </p>
      </div>
      <ul>
        <li>
          <strong>280+</strong>
          <span>vacantes verificadas</span>
        </li>
        <li>
          <strong>92%</strong>
          <span>match cultural promedio</span>
        </li>
      </ul>
    </header>

    <form class="jobs__filters" @submit.prevent="applyFilters">
      <label class="field">
        <span>Palabra clave</span>
        <BaseInput v-model="filters.query" placeholder="Diseño, datos, backend..." />
      </label>
      <label class="field">
        <span>Ubicación</span>
        <BaseInput v-model="filters.location" placeholder="Remoto LATAM, CDMX..." />
      </label>
      <label class="field">
        <span>Modalidad</span>
        <select v-model="filters.modality">
          <option v-for="option in contractOptions" :key="option.value || 'all'" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Seniority</span>
        <select v-model="filters.experience">
          <option value="intern">Intern</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </label>
      <BaseButton type="submit">Refinar búsqueda</BaseButton>
    </form>

    <section class="jobs__results">
      <p class="jobs__count">
        {{ jobsStore.loading ? 'Cargando vacantes…' : `${filteredJobs.length} vacantes activas` }}
      </p>
      <div v-if="jobsStore.loading" class="jobs__list">
        <BaseCard v-for="skeleton in 3" :key="skeleton" class="job-card job-card--skeleton">
          <div class="skeleton-line" />
          <div class="skeleton-line" />
          <div class="skeleton-line" />
        </BaseCard>
      </div>
      <div v-else class="jobs__list">
        <article v-for="job in filteredJobs" :key="job.id" class="job-card" @click="goToJob(job.id)">
          <div class="job-card__header">
            <span class="job-card__badge">{{ job.modality || 'Flexible' }}</span>
            <span class="job-card__time">{{ job.postedAgo || 'Publicado hoy' }}</span>
          </div>
          <h3>{{ job.title }}</h3>
          <p class="job-card__company">{{ job.company }}</p>
          <p class="job-card__location">{{ job.location }}</p>
          <p class="job-card__salary">{{ job.salaryRange || job.salary || 'Salario a convenir' }}</p>
          <div class="job-card__skills">
            <span v-for="skill in (job.skills.length ? job.skills : defaultSkills)" :key="skill" class="pill">{{ skill }}</span>
          </div>
        </article>
      </div>
      <BaseCard v-if="!jobsStore.loading && !filteredJobs.length" class="jobs__empty">
        <template #title>No encontramos vacantes</template>
        <p>
          {{ jobsStore.error || 'Prueba otros filtros o amplía tu ubicación para descubrir nuevos retos.' }}
        </p>
      </BaseCard>
    </section>
  </section>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useJobsStore } from '@/stores/jobsStore'

const jobsStore = useJobsStore()
const router = useRouter()
const filters = reactive({ experience: 'junior', ...jobsStore.filters })
const contractOptions = [
  { value: '', label: 'Cualquier modalidad' },
  { value: 'full-time', label: 'Tiempo completo' },
  { value: 'part-time', label: 'Medio tiempo' },
  { value: 'contract', label: 'Contrato' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporal' }
]
const defaultSkills = ['Figma', 'Notion', 'Miro']

const applyFilters = () => {
  jobsStore.setFilters(filters)
}

const filteredJobs = computed(() => {
  const { query, location, modality, experience } = filters
  const normalize = (value = '') => value.toLowerCase().trim()
  return jobsStore.jobs.filter((job) => {
    const matchesQuery = query ? `${job.title} ${job.description}`.toLowerCase().includes(normalize(query)) : true
    const matchesLocation = location ? job.location?.toLowerCase().includes(normalize(location)) : true
    const matchesModality = modality ? job.contractType === modality : true
    const matchesExperience = experience
      ? job.requirements.some((req) => req.toLowerCase().includes(normalize(experience)))
      : true
    return matchesQuery && matchesLocation && matchesModality && matchesExperience
  })
})

const goToJob = (id) => router.push(`/jobs/${id}`)

onMounted(() => {
  jobsStore.fetchJobs()
})
</script>

<style scoped>
.jobs {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.jobs__hero {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-card);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  align-items: center;
}

.jobs__hero ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 2rem;
}

.jobs__hero li {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.jobs__hero strong {
  font-size: 2rem;
  font-family: var(--font-heading);
}

.jobs__filters {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
  align-items: end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
}

.field select {
  border-radius: 1rem;
  border: 1px solid var(--clr-border);
  padding: 0.95rem 1rem;
  background: var(--clr-bg-muted);
  font-weight: 600;
}

.jobs__results {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.jobs__count {
  margin: 0;
  color: var(--clr-muted);
}

.jobs__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.job-card {
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  border: 1px solid rgba(37, 99, 235, 0.15);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(236, 244, 255, 0.9));
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: transform 150ms ease;
}

.job-card--skeleton {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  cursor: default;
}

.skeleton-line {
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.2));
  animation: pulse 1.5s ease infinite;
}

.skeleton-line:nth-child(1) {
  width: 60%;
  height: 18px;
}

.skeleton-line:nth-child(2) {
  width: 80%;
}

.skeleton-line:nth-child(3) {
  width: 40%;
}

.job-card--skeleton .pill {
  display: none;
}

.job-card--skeleton h3,
.job-card--skeleton p,
.job-card--skeleton .job-card__header {
  display: none;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

.job-card:hover {
  transform: translateY(-4px);
}

.job-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-card__badge {
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.15);
  color: var(--clr-primary);
  font-weight: 600;
}

.job-card__time {
  color: var(--clr-muted);
  font-size: 0.9rem;
}

.job-card__company {
  margin: 0;
  font-weight: 700;
}

.job-card__location {
  margin: 0;
  color: var(--clr-muted);
}

.job-card__salary {
  margin: 0.2rem 0;
  font-weight: 700;
  color: var(--clr-secondary);
}

.job-card__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.pill {
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(37, 99, 235, 0.22);
  font-size: 0.85rem;
}

.pill--ghost {
  background: rgba(37, 99, 235, 0.1);
}

.jobs__empty {
  text-align: center;
}

@media (max-width: 640px) {
  .jobs__hero ul {
    flex-direction: column;
  }

  .jobs__filters {
    padding: 1.5rem;
  }
}
</style>
