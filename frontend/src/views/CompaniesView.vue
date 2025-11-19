<template>
  <section class="companies">
    <header>
      <p class="section-kicker">Aliados estratégicos</p>
      <h2>Empresas que prototipan futuros roles con JobPortal.</h2>
      <p>Desde healthtech hasta AI ethics. Explora quién está construyendo cohorts con talento emergente.</p>
    </header>

    <div v-if="companiesStore.loading" class="companies__grid">
      <article v-for="skeleton in 3" :key="skeleton" class="company-card company-card--skeleton">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
      </article>
    </div>
    <div v-else-if="companiesStore.companies.length" class="companies__grid">
      <article v-for="company in companiesStore.companies" :key="company.id" class="company-card">
        <div class="company-card__head">
          <span class="company-card__badge">{{ company.industry }}</span>
          <span class="company-card__rating">⭐ {{ company.rating.toFixed(1) }}</span>
        </div>
        <h3>{{ company.name }}</h3>
        <p class="company-card__meta">{{ company.description || 'Equipo en crecimiento' }}</p>
        <p class="company-card__roles">{{ jobCountByCompany[company.id] || 0 }} vacantes activas</p>
        <div class="company-card__tags">
          <span class="pill">{{ company.location || 'Global' }}</span>
          <span class="pill pill--ghost">{{ company.industry || 'Innovación' }}</span>
        </div>
      </article>
    </div>
    <BaseCard v-else>
      <template #title>{{ companiesStore.error ? 'No pudimos cargar las empresas' : 'Aún no hay empresas registradas' }}</template>
      <p>
        {{ companiesStore.error || 'Registra una empresa para comenzar a publicar vacantes.' }}
      </p>
    </BaseCard>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import BaseCard from '@/components/BaseCard.vue'
import { useCompaniesStore } from '@/stores/companiesStore'
import { useJobsStore } from '@/stores/jobsStore'

const companiesStore = useCompaniesStore()
const jobsStore = useJobsStore()

const jobCountByCompany = computed(() => {
  return jobsStore.jobs.reduce((acc, job) => {
    const companyId = job.companyId
    if (!companyId) return acc
    acc[companyId] = (acc[companyId] || 0) + 1
    return acc
  }, {})
})

onMounted(() => {
  companiesStore.fetchCompanies()
  if (!jobsStore.jobs.length) {
    jobsStore.fetchJobs({ status: 'active' })
  }
})
</script>

<style scoped>
.companies {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.companies header {
  max-width: 720px;
}

.companies__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.company-card {
  border-radius: var(--radius-lg);
  padding: 1.8rem;
  border: 1px solid rgba(37, 99, 235, 0.14);
  background: var(--clr-surface);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.company-card__head {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.company-card__badge {
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--clr-primary);
}

.company-card__meta {
  margin: 0;
  color: var(--clr-muted);
}

.company-card__roles {
  margin: 0;
  font-weight: 700;
}

.company-card__tags {
  display: flex;
  gap: 0.6rem;
  margin-top: auto;
}

.pill {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.2);
  font-size: 0.85rem;
}

.pill--ghost {
  background: rgba(37, 99, 235, 0.08);
}

.company-card--skeleton {
  gap: 1rem;
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
  width: 90%;
}

.skeleton-line:nth-child(3) {
  width: 40%;
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
</style>
