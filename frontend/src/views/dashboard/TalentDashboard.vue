<template>
  <section class="talent-dashboard">
    <div class="talent-dashboard__grid">
      <BaseCard class="match-card">
        <template #title>Vacantes recomendadas</template>
        <p class="muted">Basado en tus skills y búsquedas recientes.</p>
        <table class="matches-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Compañía</th>
              <th>Modalidad</th>
              <th>Compensación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in jobMatches" :key="job.id" @click="goToJob(job.id)">
              <td>{{ job.title }}</td>
              <td>{{ job.company }}</td>
              <td>{{ job.modality || 'Flexible' }}</td>
              <td>{{ job.salaryRange || job.salary || 'A convenir' }}</td>
            </tr>
            <tr v-if="!jobMatches.length">
              <td colspan="4" class="empty">Aún no hay coincidencias. Explora nuevas áreas para desbloquear recomendaciones.</td>
            </tr>
          </tbody>
        </table>
        <template #footer>
          <div class="match-card__footer">
            <p>Sugerimos roles compatibles con tu portafolio y cohort actual.</p>
            <BaseButton size="sm" @click="router.push('/jobs')">Ir al buscador</BaseButton>
          </div>
        </template>
      </BaseCard>

      <div class="talent-dashboard__stack">
        <BaseCard class="resource-card">
          <template #title>Recursos activos</template>
          <ul class="list">
            <li v-for="resource in resourceHighlights" :key="resource.id || resource.title">
              <div>
                <span class="pill">{{ resource.format }}</span>
                <strong>{{ resource.title }}</strong>
                <p>{{ resource.description }}</p>
              </div>
              <button type="button" class="link-button" @click="goToResource">Abrir</button>
            </li>
            <li v-if="!resourceHighlights.length" class="empty">Publicaremos nuevos recursos muy pronto.</li>
          </ul>
        </BaseCard>

        <BaseCard class="community-card">
          <template #title>Comunidad y foros</template>
          <ul class="list">
            <li v-for="thread in communityThreads" :key="thread.id || thread.title">
              <div>
                <strong>{{ thread.title }}</strong>
                <p>{{ thread.preview }}</p>
              </div>
              <button type="button" class="pill-button" @click="goToForum">{{ thread.category }}</button>
            </li>
            <li v-if="!communityThreads.length" class="empty">Aún no hay conversaciones activas.</li>
          </ul>
        </BaseCard>
      </div>
    </div>

    <BaseCard class="talent-dashboard__support" variant="glass">
      <template #title>¿Necesitas ayuda?</template>
      <p>Escríbenos para ajustar tu perfil o solicitar mentoría personalizada.</p>
      <div class="actions">
        <BaseButton variant="ghost" size="sm" @click="openSupport('mailto:soporte@jobportal.dev')">Enviar correo</BaseButton>
        <button type="button" class="link-button" @click="openSupport('https://cal.com/jobportal/support')">Agenda una llamada →</button>
      </div>
    </BaseCard>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useJobsStore } from '@/stores/jobsStore'
import { useResourcesStore } from '@/stores/resourcesStore'
import { useForumStore } from '@/stores/forumStore'

const jobsStore = useJobsStore()
const resourcesStore = useResourcesStore()
const forumStore = useForumStore()
const router = useRouter()

const jobMatches = computed(() => jobsStore.jobs.slice(0, 5))
const resourceHighlights = computed(() => resourcesStore.resources.slice(0, 3))
const communityThreads = computed(() => forumStore.threads.slice(0, 3))

const goToJob = (id) => {
  if (!id) return
  router.push({ name: 'job-detail', params: { id } })
}

const goToResource = () => router.push('/resources')
const goToForum = () => router.push('/forum')
const openSupport = (url) => window.open(url, '_blank')

onMounted(() => {
  if (!jobsStore.jobs.length) {
    jobsStore.fetchJobs()
  }
  if (!resourcesStore.resources.length) {
    resourcesStore.fetchResources()
  }
  if (!forumStore.threads.length) {
    forumStore.fetchThreads()
  }
})
</script>

<style scoped>
.talent-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.talent-dashboard__grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.talent-dashboard__stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.match-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(219, 234, 254, 0.9));
  border: 1px solid rgba(37, 99, 235, 0.12);
}

.matches-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.matches-table th,
.matches-table td {
  text-align: left;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.matches-table tr {
  cursor: pointer;
}

.matches-table tr:hover {
  background: rgba(148, 163, 184, 0.08);
}

.match-card__footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.resource-card .pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: var(--clr-primary);
  font-weight: 600;
  font-size: 0.8rem;
}

.community-card {
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.75));
  color: #f8fafc;
}

.community-card .pill-button {
  background: rgba(59, 130, 246, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.muted {
  color: var(--clr-muted);
  margin: 0;
}

.empty {
  text-align: center;
  padding: 1.5rem 0;
  color: var(--clr-muted);
}

.link-button {
  border: none;
  background: none;
  color: var(--clr-primary);
  font-weight: 600;
  cursor: pointer;
}

.pill-button {
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  background: rgba(37, 99, 235, 0.12);
  color: var(--clr-primary);
  font-weight: 600;
  cursor: pointer;
}

.talent-dashboard__support {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.talent-dashboard__support .actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .talent-dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
