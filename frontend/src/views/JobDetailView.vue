<template>
  <section class="job-detail" v-if="job">
    <div class="job-detail__header">
      <BaseButton variant="ghost" size="sm" @click="goBack">← Volver</BaseButton>
      <span class="job-detail__badge">{{ job.modality || 'Flexible' }}</span>
    </div>
    <div class="job-detail__layout">
      <article class="job-detail__content">
        <BaseCard variant="glass">
          <template #title>{{ job.title }}</template>
          <p class="job-detail__company">{{ job.company }} · {{ job.location }}</p>
          <p class="job-detail__salary">{{ job.salaryRange || job.salary }}</p>
          <div class="job-detail__meta">
            <div>
              <small>Nivel</small>
              <strong>{{ job.seniority || 'Intermedio' }}</strong>
            </div>
            <div>
              <small>Publicado</small>
              <strong>{{ job.postedAgo || 'Hoy' }}</strong>
            </div>
            <div>
              <small>Horario</small>
              <strong>{{ job.schedule || 'Tiempo completo' }}</strong>
            </div>
          </div>
          <section class="job-detail__section">
            <h3>Descripción</h3>
            <p>
              {{ job.description || 'Experimenta con desafíos reales: iteraciones con stakeholders, research vivo y acceso a frameworks exclusivos.' }}
            </p>
          </section>
          <section class="job-detail__section">
            <h3>Requerimientos</h3>
            <ul>
              <li v-for="requirement in requirements" :key="requirement">{{ requirement }}</li>
            </ul>
          </section>
          <section class="job-detail__section">
            <h3>Skills</h3>
            <ul class="job-detail__skills">
              <li v-for="skill in (job.skills || placeholderSkills)" :key="skill">{{ skill }}</li>
            </ul>
          </section>
          <div class="job-detail__apply">
            <BaseButton size="lg" :is-loading="applyState.loading" :disabled="alreadyApplied" @click="applyToJob">
              {{ alreadyApplied ? 'Ya postulaste' : 'Aplicar ahora' }}
            </BaseButton>
            <p v-if="applyState.error" class="job-detail__status job-detail__status--error">{{ applyState.error }}</p>
            <p v-if="applyState.success" class="job-detail__status">¡Listo! Tu perfil fue enviado.</p>
          </div>
        </BaseCard>
      </article>
      <aside class="job-detail__sidebar">
        <BaseCard>
          <template #title>Sobre la empresa</template>
          <p class="job-detail__company-info">{{ companyInfo.summary }}</p>
          <ul class="job-detail__facts">
            <li>
              <span>Equipo</span>
              <strong>{{ companyInfo.size }}</strong>
            </li>
            <li>
              <span>Headquarters</span>
              <strong>{{ companyInfo.hq }}</strong>
            </li>
            <li>
              <span>Industria</span>
              <strong>{{ companyInfo.industry }}</strong>
            </li>
          </ul>
        </BaseCard>
        <BaseCard>
          <template #title>Valoraciones</template>
          <div class="job-detail__ratings">
            <div>
              <p class="job-detail__rating-score">{{ averageRatingText }}</p>
              <small>{{ totalReviews }} reseñas</small>
            </div>
            <div class="job-detail__stars">
              <span
                v-for="star in 5"
                :key="star"
                :class="['star', { 'star--active': star <= Math.round(averageRatingValue) }]"
              ></span>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
    <section class="job-detail__comments">
      <header>
        <div>
          <p class="section-kicker">Feedback de cohorts</p>
          <h3>Lo que dice la comunidad.</h3>
        </div>
        <div class="job-detail__review-form">
          <label>
            <span>Valoración</span>
            <select v-model.number="reviewForm.rating">
              <option v-for="rating in [5, 4, 3, 2, 1]" :key="rating" :value="rating">{{ rating }} / 5</option>
            </select>
          </label>
          <textarea v-model="reviewForm.comment" placeholder="Comparte tu experiencia con este equipo" rows="3"></textarea>
          <BaseButton size="sm" @click="submitReview">Publicar</BaseButton>
        </div>
      </header>
      <ul class="job-detail__review-list">
        <li v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-card__header">
            <strong>{{ review.author }}</strong>
            <span>{{ formatDate(review.date) }}</span>
          </div>
          <div class="review-card__rating">
            <span v-for="star in 5" :key="star" :class="['star', { 'star--active': star <= review.rating }]"></span>
            <small>{{ review.rating }}/5</small>
          </div>
          <p>{{ review.comment }}</p>
        </li>
      </ul>
    </section>
  </section>
  <section v-else class="job-detail job-detail--empty">
    <BaseCard>
      <template #title>Selecciona una vacante</template>
      <p>Explora el radar y elige un rol para ver los detalles.</p>
    </BaseCard>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useJobsStore } from '@/stores/jobsStore'
import { useAuthStore } from '@/stores/authStore'
import { apiRequest } from '@/services/httpClient'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const placeholderSkills = ['OKRs', 'Figma', 'Notion', 'User interviews']
const placeholderRequirements = [
  'Disponibilidad para colaborar 15 horas semanales en ciclos ágiles.',
  'Documentar hallazgos en Notion y presentar recap semanal.',
  'Nivel conversacional de inglés para syncs con mentores globales.'
]
const placeholderReviews = [
  {
    id: 'r-1',
    author: 'Majo · Diseñadora',
    rating: 5,
    comment: 'Proceso súper humano, recibí feedback accionable en cada sprint.',
    date: '2025-08-10'
  },
  {
    id: 'r-2',
    author: 'Ricardo · Data',
    rating: 4,
    comment: 'La empresa está iterando rápido, hay espacio para proponer.',
    date: '2025-08-02'
  }
]

const job = computed(() => jobsStore.selectedJob)
const requirements = computed(() => (job.value?.requirements?.length ? job.value.requirements : placeholderRequirements))

const companyInfo = computed(() => ({
  summary:
    job.value?.companySummary ||
    'Startup enfocada en crear experiencias data-informed para escalar productos con cohorts universitarios.',
  size: job.value?.companySize || '50 - 80 personas',
  hq: job.value?.companyHq || 'CDMX · Remote first',
  industry: job.value?.industry || 'Producto digital'
}))

const applyState = reactive({ loading: false, error: '', success: false })
const alreadyApplied = ref(false)
const reviews = ref([...placeholderReviews])
const reviewsLoading = ref(false)
const reviewForm = reactive({ rating: 5, comment: '' })

const fetchCompanyReviews = async (companyId) => {
  if (!companyId) {
    reviews.value = [...placeholderReviews]
    return
  }
  reviewsLoading.value = true
  try {
    const data = await apiRequest('/reviews', { params: { company: companyId } })
    reviews.value = Array.isArray(data) && data.length
      ? data.map((review) => ({
          id: review._id,
          author: review.author?.name || 'Talento JobPortal',
          rating: review.rating,
          comment: review.comment,
          date: review.publishedAt || review.createdAt
        }))
      : [...placeholderReviews]
  } catch (error) {
    reviews.value = [...placeholderReviews]
  } finally {
    reviewsLoading.value = false
  }
}

const markApplicationStatus = async (jobId) => {
  if (!authStore.isAuthenticated || !jobId) {
    alreadyApplied.value = false
    return
  }
  try {
    const data = await apiRequest('/applications', { params: { job: jobId }, auth: true })
    const authUserId = authStore.user?._id || authStore.user?.id
    alreadyApplied.value = Array.isArray(data)
      ? data.some((application) => {
          const candidateId = application.candidate?._id || application.candidate
          return candidateId === authUserId
        })
      : false
  } catch (error) {
    alreadyApplied.value = false
  }
}

watch(job, (value) => {
  if (!value) return
  fetchCompanyReviews(value.companyId)
  markApplicationStatus(value.id)
})

const averageRatingValue = computed(() => {
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((acc, review) => acc + Number(review.rating || 0), 0)
  return sum / reviews.value.length
})

const averageRatingText = computed(() => averageRatingValue.value.toFixed(1))
const totalReviews = computed(() => reviews.value.length)

const applyToJob = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (!job.value || alreadyApplied.value || applyState.loading) return

  applyState.loading = true
  applyState.error = ''
  try {
    await apiRequest('/applications', {
      method: 'POST',
      data: { job: job.value.id },
      auth: true
    })
    alreadyApplied.value = true
    applyState.success = true
  } catch (error) {
    applyState.error = error.message || 'No pudimos registrar tu postulación'
  } finally {
    applyState.loading = false
  }
}

const submitReview = () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (!reviewForm.comment.trim()) return

  reviews.value = [
    {
      id: Date.now().toString(),
      author: authStore.user?.name || 'Talento JobPortal',
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      date: new Date().toISOString()
    },
    ...reviews.value
  ]
  reviewForm.comment = ''
}

const formatDate = (value) => {
  if (!value) return 'Reciente'
  const date = new Date(value)
  return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
}

const goBack = () => {
  router.back()
}

const loadJob = async (id) => {
  if (!id) return
  await jobsStore.fetchJobById(id)
}

watch(
  () => route.params.id,
  (id) => {
    if (id) {
      loadJob(id)
    }
  }
)

onMounted(() => {
  loadJob(route.params.id)
})
</script>

<style scoped>
.job-detail {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.job-detail__layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 1.5rem;
}

.job-detail__content {
  min-width: 0;
}

.job-detail__sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.job-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-detail__badge {
  padding: 0.35rem 1rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.15);
  color: var(--clr-primary);
  font-weight: 600;
}

.job-detail__company {
  font-weight: 600;
  color: var(--clr-muted);
}

.job-detail__salary {
  font-weight: 700;
  color: var(--clr-secondary);
  font-size: 1.4rem;
}

.job-detail__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0 1.5rem;
}

.job-detail__meta small {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--clr-muted);
}

.job-detail__skills {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.job-detail__skills li {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.job-detail__section {
  margin: 1.5rem 0;
}

.job-detail__section h3 {
  margin: 0 0 0.6rem;
}

.job-detail__section ul {
  padding-left: 1.2rem;
  color: var(--clr-muted);
}

.job-detail__apply {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.job-detail__status {
  margin: 0;
  font-weight: 600;
  color: var(--clr-primary);
}

.job-detail__status--error {
  color: #dc2626;
}

.job-detail__company-info {
  color: var(--clr-muted);
}

.job-detail__facts {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.5rem;
}

.job-detail__facts li {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.job-detail__ratings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-detail__rating-score {
  margin: 0;
  font-size: 2.5rem;
  font-family: var(--font-heading);
}

.job-detail__stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.1);
}

.star--active {
  background: linear-gradient(135deg, var(--clr-primary), var(--clr-accent));
}

.job-detail__comments {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.job-detail__comments header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.job-detail__review-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.job-detail__review-form textarea,
.job-detail__review-form select {
  border-radius: 1rem;
  border: 1px solid var(--clr-border);
  padding: 0.9rem 1rem;
  background: var(--clr-bg-muted);
  font-family: inherit;
}

.job-detail__review-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.review-card {
  border: 1px solid rgba(37, 99, 235, 0.14);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  background: var(--clr-surface-alt);
}

.review-card__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.review-card__rating {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  color: var(--clr-muted);
}

.job-detail--empty {
  opacity: 0.85;
}

@media (max-width: 960px) {
  .job-detail__layout {
    grid-template-columns: 1fr;
  }

  .job-detail__sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
