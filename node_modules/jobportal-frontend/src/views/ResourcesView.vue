<template>
  <section class="resources">
    <header class="resources__hero">
      <div class="hero__content">
        <p class="section-kicker">Librería viva</p>
        <h2>Recursos curados para diseñar tu roadmap profesional con intención.</h2>
        <p>
          Playbooks, talleres y plantillas auditadas cada semana por mentores operando en squads reales.
          <BaseButton type="button" @click="openCreationModal">Publicar recurso</BaseButton>
          <BaseButton type="button" variant="ghost">Explorar colecciones</BaseButton>
        </p>
        <div class="hero__badges">
          <span v-for="badge in heroBadges" :key="badge">{{ badge }}</span>
        </div>
        <div class="hero__actions">
          <BaseButton>Explorar colecciones</BaseButton>
          <button class="hero__link" type="button">Ver calendario de drops</button>
        </div>
      </div>
      <div class="hero__board">
        <article v-for="highlight in heroHighlights" :key="highlight.label" class="board-card">
          <p>{{ highlight.label }}</p>
          <strong>{{ highlight.value }}</strong>
          <small>{{ highlight.description }}</small>
        </article>
      </div>
    </header>

    <section class="resources__filters">
      <BaseInput v-model="searchQuery" placeholder="Buscar playbooks, talleres o plantillas" />
      <div class="filters__groups">
        <div class="filters__chips">
          <button
            v-for="filter in categoryFilters"
            :key="filter"
            type="button"
            class="filter-chip"
            :class="{ 'is-active': filter === selectedFilter }"
            @click="selectedFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
        <div class="filters__chips filters__chips--ghost">
          <button
            v-for="status in statusFilters"
            :key="status"
            type="button"
            class="filter-pill"
            :class="{ 'is-active': status === selectedStatus }"
            @click="selectedStatus = status"
          >
            {{ status }}
          </button>
        </div>
      </div>
      <div class="filters__meta">
        <span>{{ resourcesStore.loading ? 'Cargando recursos…' : `${activeResources} recursos listos` }}</span>
        <p>{{ resourcesStore.error || 'Actualizados cada lunes con feedback real.' }}</p>
      </div>
    </section>

    <section class="resources__layout">
      <article v-if="spotlightResource" class="resource-spotlight">
        <header>
          <div class="spotlight__meta">
            <span class="spotlight__format">{{ spotlightResource.format }}</span>
            <span v-for="status in spotlightResource.status" :key="status" class="spotlight__status">
              {{ status }}
            </span>
          </div>
          <span>{{ spotlightResource.date }}</span>
        </header>
        <h3>{{ spotlightResource.title }}</h3>
        <p>{{ spotlightResource.description }}</p>
        <ul class="spotlight__tags">
          <li v-for="tag in spotlightResource.tags" :key="tag">{{ tag }}</li>
        </ul>
        <div class="spotlight__footer">
          <div>
            <small>Autor</small>
            <p>{{ spotlightResource.author }}</p>
          </div>
          <div>
            <small>Duración</small>
            <p>{{ spotlightResource.duration }}</p>
          </div>
          <BaseButton size="sm">Abrir spotlight</BaseButton>
        </div>
      </article>
      <article v-else-if="resourcesStore.loading" class="resource-spotlight resource-spotlight--skeleton">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
      </article>
      <BaseCard v-else-if="resourcesStore.error" class="resource-spotlight">
        <template #title>No pudimos cargar la librería</template>
        <p>{{ resourcesStore.error }}</p>
      </BaseCard>

      <div v-if="resourcesStore.loading" class="resource-grid">
        <article v-for="skeleton in 6" :key="skeleton" class="resource-card resource-card--skeleton">
          <div class="skeleton-line" />
          <div class="skeleton-line" />
          <div class="skeleton-line" />
        </article>
      </div>
      <div v-else class="resource-grid" :class="{ 'resource-grid--empty': !gridResources.length }">
        <article v-for="resource in gridResources" :key="resource.id" class="resource-card">
          <div class="resource-card__labels">
            <span class="resource-card__format">{{ resource.format }}</span>
            <span v-if="resource.status?.length" class="resource-card__status">{{ resource.status[0] }}</span>
          </div>
          <h4>{{ resource.title }}</h4>
          <p>{{ resource.description }}</p>
          <ul class="resource-card__tags">
            <li v-for="tag in resource.tags" :key="tag">{{ tag }}</li>
          </ul>
          <div class="resource-card__meta">
            <div>
              <small>Categoría</small>
              <p>{{ resource.category }}</p>
            </div>
            <div>
              <small>Duración</small>
              <p>{{ resource.duration }}</p>
            </div>
            <div>
              <small>Actualización</small>
              <p>{{ resource.date }}</p>
            </div>
          </div>
          <div class="resource-card__footer">
            <span>Por {{ resource.author }}</span>
            <BaseButton variant="secondary" size="sm">Abrir recurso</BaseButton>
          </div>
        </article>
        <p v-if="!visibleResources.length" class="resource-grid__empty">No hay resultados para este filtro todavía.</p>
      </div>
    </section>

    <section class="resources__collections">
      <template v-if="resourcesStore.loading">
        <article v-for="skeleton in 2" :key="`collection-${skeleton}`" class="collection-card collection-card--skeleton">
          <div class="skeleton-line" />
          <div class="skeleton-line" />
          <div class="skeleton-line" />
        </article>
      </template>
      <article v-else-if="!groupedResources.length && !resourcesStore.error" class="collection-card">
        <p class="section-kicker">Colecciones en camino</p>
        <h3>Necesitamos más recursos</h3>
        <p>Añade nuevos recursos para desbloquear colecciones curadas.</p>
      </article>
      <template v-else>
        <article v-for="group in groupedResources" :key="group.format" class="collection-card">
          <div class="collection-card__header">
            <div>
              <p class="section-kicker">{{ group.detail.kicker }}</p>
              <h3>{{ group.detail.title }}</h3>
              <p>{{ group.detail.description }}</p>
            </div>
            <BaseButton variant="ghost" size="sm">Ver colección</BaseButton>
          </div>
          <div v-if="group.items.length" class="collection-card__grid">
            <article v-for="item in group.items" :key="item.id" class="collection-card__item">
              <header>
                <span>{{ item.duration }}</span>
                <span>{{ item.date }}</span>
              </header>
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
              <footer>
                <span>Por {{ item.author }}</span>
                <button type="button">Guardar</button>
              </footer>
            </article>
          </div>
          <p v-else class="collection-card__empty">Sin recursos para esta categoría.</p>
        </article>
      </template>
      <BaseCard v-if="resourcesStore.error" class="collection-card__error">
        <template #title>Error al cargar colecciones</template>
        <p>{{ resourcesStore.error }}</p>
        <BaseButton size="sm" variant="ghost" @click="resourcesStore.fetchResources()">Reintentar</BaseButton>
      </BaseCard>
    </section>

    <div v-if="isCreationModalOpen" class="resource-modal" role="dialog" aria-modal="true">
      <div class="resource-modal__panel">
        <header class="resource-modal__header">
          <div>
            <p class="section-kicker">Nuevo recurso</p>
            <h3>Publica videos, artículos o playbooks curados para tu cohorte.</h3>
            <p>Comparte contexto, duración estimada y enlaces accionables.</p>
          </div>
          <button class="resource-modal__close" type="button" aria-label="Cerrar" @click="closeCreationModal">×</button>
        </header>
        <section class="resource-modal__body">
          <form class="resource-modal__form" @submit.prevent="handleCreateResource">
            <div class="resource-modal__types">
              <button
                v-for="type in RESOURCE_TYPES"
                :key="type.value"
                type="button"
                class="resource-type-card"
                :class="{ 'is-active': resourceForm.mediaType === type.value }"
                :style="{ '--resource-accent': type.accent }"
                @click="resourceForm.mediaType = type.value"
              >
                <strong>{{ type.label }}</strong>
                <small>{{ type.description }}</small>
              </button>
            </div>
            <div class="modal-grid">
              <BaseInput v-model="resourceForm.title" label="Título" placeholder="Ej. Playbook de onboarding async" />
              <BaseInput
                v-model="resourceForm.category"
                label="Categoría"
                placeholder="Producto, Carrera, Growth…"
              />
            </div>
            <label class="modal-field">
              <span>Resumen ejecutivo</span>
              <textarea
                v-model="resourceForm.summary"
                rows="3"
                placeholder="Cuenta qué problema resuelve y qué entregables incluye."
              ></textarea>
            </label>
            <label class="modal-field">
              <span>Contenido / instrucciones</span>
              <textarea
                v-model="resourceForm.content"
                rows="6"
                placeholder="Describe los pasos, materiales, checklist o enlaces clave."
              ></textarea>
            </label>
            <div class="modal-grid modal-grid--compact">
              <BaseInput v-model="resourceForm.duration" label="Duración estimada" placeholder="10 min" />
              <BaseInput v-model="resourceForm.tags" label="Tags (coma)" placeholder="Mentoría, Sprint, UX" />
            </div>
            <label class="modal-field">
              <span>{{ selectedBlueprint.requiresMedia ? 'Enlace del video o demo' : 'Enlace de apoyo (opcional)' }}</span>
              <input
                v-model="resourceForm.mediaUrl"
                type="url"
                :placeholder="selectedBlueprint.mediaPlaceholder"
              />
            </label>
            <p class="modal-hint">{{ selectedBlueprint.helper }}</p>
            <p v-if="resourceModalState.error" class="modal-field__error">{{ resourceModalState.error }}</p>
            <p v-if="resourceModalState.success" class="modal-field__success">{{ resourceModalState.success }}</p>
            <div class="resource-modal__actions">
              <BaseButton type="button" variant="ghost" @click="closeCreationModal">Cancelar</BaseButton>
              <BaseButton type="submit" :disabled="resourceModalState.isSubmitting">
                {{ resourceModalState.isSubmitting ? 'Publicando…' : 'Publicar recurso' }}
              </BaseButton>
            </div>
          </form>
          <aside class="resource-modal__preview">
            <p class="section-kicker">Vista previa</p>
            <article class="resource-card resource-card--preview">
              <div class="resource-card__labels">
                <span class="resource-card__format">{{ creationPreview.format }}</span>
                <span class="resource-card__status">Nuevo</span>
              </div>
              <h4>{{ creationPreview.title }}</h4>
              <p>{{ creationPreview.description }}</p>
              <ul class="resource-card__tags">
                <li v-for="tag in creationPreview.tags" :key="tag">{{ tag }}</li>
              </ul>
              <div class="resource-card__meta">
                <div>
                  <small>Categoría</small>
                  <p>{{ creationPreview.category }}</p>
                </div>
                <div>
                  <small>Duración</small>
                  <p>{{ creationPreview.duration }}</p>
                </div>
              </div>
              <div class="resource-card__footer">
                <span>Por {{ creationPreview.author }}</span>
                <BaseButton variant="secondary" size="sm" type="button" disabled>Vista previa</BaseButton>
              </div>
            </article>
            <p v-if="resourceForm.mediaUrl" class="resource-modal__media">
              Enlace adjunto:
              <a :href="resourceForm.mediaUrl" target="_blank" rel="noopener">{{ resourceForm.mediaUrl }}</a>
            </p>
          </aside>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useResourcesStore } from '@/stores/resourcesStore'
import { useAuthStore } from '@/stores/authStore'

const resourcesStore = useResourcesStore()
const authStore = useAuthStore()
const router = useRouter()

const statusFilters = ['Todos', 'Nuevo']
const heroBadges = ['Playbooks accionables', 'Feedback curado', 'Ready to ship']
const RESOURCE_TYPES = [
  {
    value: 'article',
    label: 'Artículo táctico',
    format: 'Artículo',
    description: 'Ideal para guías y lecturas accionables.',
    accent: '#6366f1',
    defaultDuration: '8 min',
    helper: 'Comparte frameworks, aprendizajes y anexos listos para compartir.',
    requiresMedia: false,
    mediaPlaceholder: 'https://mi-blog.com/roadmap'
  },
  {
    value: 'video',
    label: 'Video guía',
    format: 'Video',
    description: 'Perfecto para demos o tutoriales hands-on.',
    accent: '#0ea5e9',
    defaultDuration: '5 min',
    helper: 'Sube tu demo a Loom, YouTube o Vimeo y pega el enlace.',
    requiresMedia: true,
    mediaPlaceholder: 'https://loom.com/share/demo'
  },
  {
    value: 'playbook',
    label: 'Playbook / Taller',
    format: 'Playbook',
    description: 'Plantillas descargables, workshops o kits.',
    accent: '#f97316',
    defaultDuration: '15 min',
    helper: 'Comparte links a Notion, FigJam, Figma o Slides.',
    requiresMedia: false,
    mediaPlaceholder: 'https://notion.so/mi-playbook'
  }
]
const DEFAULT_RESOURCE_TYPE = RESOURCE_TYPES.find((type) => type.value === 'article') || RESOURCE_TYPES[0]

const formatDetails = {
  Playbook: {
    kicker: 'Guías accionables',
    title: 'Playbooks & frameworks',
    description: 'Secuencias paso a paso para documentar decisiones y alinear squads.'
  },
  Taller: {
    kicker: 'Workshops guiados',
    title: 'Talleres & labs',
    description: 'Sesiones listas para facilitar con agenda, prompts y entregables.'
  },
  Artículo: {
    kicker: 'Lecturas rápidas',
    title: 'Artículos & briefs',
    description: 'Capsulas para revisar en menos de 10 minutos y compartir insights.'
  },
  Plantilla: {
    kicker: 'Formatos reutilizables',
    title: 'Plantillas listas para iterar',
    description: 'Documentos editables para aplicar con tu cohorte.'
  }
}

const defaultFormatDetail = (format) => ({
  kicker: 'Colección curada',
  title: format,
  description: 'Recursos seleccionados de la biblioteca JobPortal.'
})

const searchQuery = ref('')
const selectedFilter = ref('Todos')
const selectedStatus = ref(statusFilters[0])
const isCreationModalOpen = ref(false)

const resourceForm = reactive({
  title: '',
  category: '',
  mediaType: DEFAULT_RESOURCE_TYPE.value,
  format: DEFAULT_RESOURCE_TYPE.format,
  summary: '',
  mediaUrl: '',
  duration: DEFAULT_RESOURCE_TYPE.defaultDuration,
  content: '',
  tags: ''
})

const resourceModalState = reactive({
  error: '',
  success: '',
  isSubmitting: false
})

const categoryFilters = computed(() => {
  const categories = Array.from(new Set(resourcesStore.resources.map((resource) => resource.category)))
  return ['Todos', ...categories]
})

const categorySuggestions = computed(() => categoryFilters.value.filter((category) => category !== 'Todos'))

watch(categoryFilters, (filters) => {
  if (!filters.includes(selectedFilter.value)) {
    selectedFilter.value = 'Todos'
  }
})

watch(categorySuggestions, (categories) => {
  if (!categories.length) return
  if (!categories.includes(resourceForm.category)) {
    resourceForm.category = categories[0]
  }
})

const visibleResources = computed(() => {
  let list = resourcesStore.resources
  if (selectedFilter.value !== 'Todos') {
    list = list.filter((item) => item.category === selectedFilter.value)
  }
  if (selectedStatus.value !== 'Todos') {
    list = list.filter((item) => item.status?.includes(selectedStatus.value))
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }
  return list
})

const spotlightResource = computed(() => {
  if (!visibleResources.value.length) return null
  return visibleResources.value.find((item) => item.status?.includes('Nuevo')) || visibleResources.value[0]
})

const gridResources = computed(() => {
  if (!spotlightResource.value) return visibleResources.value
  return visibleResources.value.filter((item) => item.id !== spotlightResource.value.id)
})

const groupedResources = computed(() => {
  const formats = Array.from(new Set(visibleResources.value.map((item) => item.format)))
  return formats.map((format) => ({
    format,
    detail: formatDetails[format] || defaultFormatDetail(format),
    items: visibleResources.value.filter((item) => item.format === format)
  }))
})

const activeResources = computed(() => visibleResources.value.length)

const formatNumber = (value) => new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(value || 0)

const recentResources = computed(() => resourcesStore.resources.filter((resource) => resource.status.includes('Nuevo')))

const averageReadTime = computed(() => {
  if (!resourcesStore.resources.length) return '–'
  const totalMinutes = resourcesStore.resources.reduce((acc, resource) => {
    const minutes = parseInt(resource.duration, 10)
    return acc + (Number.isFinite(minutes) ? minutes : 10)
  }, 0)
  return `${Math.max(1, Math.round(totalMinutes / resourcesStore.resources.length))} min`
})

const heroHighlights = computed(() => [
  { label: 'Recursos publicados', value: formatNumber(resourcesStore.resources.length), description: 'Listos para cohorts' },
  { label: 'Actualizados este mes', value: formatNumber(recentResources.value.length), description: 'Entradas recientes' },
  { label: 'Lectura estimada', value: averageReadTime.value, description: 'Tiempo promedio' }
])

const selectedBlueprint = computed(() => RESOURCE_TYPES.find((type) => type.value === resourceForm.mediaType) || RESOURCE_TYPES[0])

watch(
  () => resourceForm.mediaType,
  () => {
    const blueprint = selectedBlueprint.value
    resourceForm.format = blueprint.format
    if (!resourceForm.duration) {
      resourceForm.duration = blueprint.defaultDuration
    }
  },
  { immediate: true }
)

const parsedTags = computed(() => {
  return resourceForm.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag, index, list) => tag && list.indexOf(tag) === index)
    .slice(0, 6)
})

const previewTags = computed(() => (parsedTags.value.length ? parsedTags.value : ['Mentoría', 'Sprint']))

const creationPreview = computed(() => ({
  title: resourceForm.title || 'Nuevo recurso sin título',
  category: resourceForm.category || categorySuggestions.value[0] || 'Carrera',
  format: selectedBlueprint.value.format,
  description:
    resourceForm.summary || 'Describe el objetivo, entregables y resultados esperados de tu recurso.',
  tags: previewTags.value,
  duration: resourceForm.duration || selectedBlueprint.value.defaultDuration,
  author: authStore.user?.name || 'Equipo JobPortal'
}))

const ensureAuthenticated = () => {
  if (authStore.isAuthenticated) return true
  router.push({ name: 'login', query: { redirect: '/resources' } })
  return false
}

const resetResourceForm = () => {
  const fallbackCategory = categorySuggestions.value[0] || 'Carrera'
  resourceForm.title = ''
  resourceForm.category = fallbackCategory
  resourceForm.mediaType = DEFAULT_RESOURCE_TYPE.value
  resourceForm.format = DEFAULT_RESOURCE_TYPE.format
  resourceForm.summary = ''
  resourceForm.mediaUrl = ''
  resourceForm.duration = DEFAULT_RESOURCE_TYPE.defaultDuration
  resourceForm.content = ''
  resourceForm.tags = ''
}

const openCreationModal = () => {
  if (!ensureAuthenticated()) return
  resetResourceForm()
  resourceModalState.error = ''
  resourceModalState.success = ''
  isCreationModalOpen.value = true
}

const closeCreationModal = () => {
  isCreationModalOpen.value = false
  resourceModalState.error = ''
  resourceModalState.success = ''
  resetResourceForm()
}

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch (error) {
    return false
  }
}

const handleCreateResource = async () => {
  if (!ensureAuthenticated() || resourceModalState.isSubmitting) return
  resourceModalState.error = ''
  const title = resourceForm.title.trim()
  const category = resourceForm.category.trim()
  const summary = resourceForm.summary.trim()
  const content = resourceForm.content.trim()
  const duration = resourceForm.duration.trim()
  const mediaUrl = resourceForm.mediaUrl.trim()
  const blueprint = selectedBlueprint.value

  if (title.length < 4) {
    resourceModalState.error = 'El título necesita al menos 4 caracteres.'
    return
  }
  if (category.length < 3) {
    resourceModalState.error = 'Define una categoría clara para clasificar el recurso.'
    return
  }
  if (summary && summary.length < 20) {
    resourceModalState.error = 'El resumen debe tener al menos 20 caracteres.'
    return
  }
  if (content.length < 60) {
    resourceModalState.error = 'Comparte al menos 60 caracteres de contexto o instrucciones.'
    return
  }
  if (!duration) {
    resourceModalState.error = 'Incluye una duración estimada.'
    return
  }
  if (blueprint.requiresMedia && !mediaUrl) {
    resourceModalState.error = 'Adjunta el enlace del video o demo.'
    return
  }
  if (mediaUrl && !isValidHttpUrl(mediaUrl)) {
    resourceModalState.error = 'El enlace debe ser una URL válida.'
    return
  }

  resourceModalState.isSubmitting = true
  try {
    await resourcesStore.createResource({
      title,
      category,
      content,
      summary: summary || undefined,
      format: blueprint.format,
      mediaType: blueprint.value,
      mediaUrl: mediaUrl || undefined,
      duration,
      author: authStore.user?.name || 'Equipo JobPortal',
      tags: parsedTags.value
    })
    resourceModalState.success = 'Recurso publicado correctamente.'
    resetResourceForm()
  } catch (error) {
    resourceModalState.error = error?.message || 'No pudimos publicar el recurso. Intentalo nuevamente.'
  } finally {
    resourceModalState.isSubmitting = false
  }
}

onMounted(() => {
  resourcesStore.fetchResources()
})
</script>

<style scoped>
.resources {
  padding: 3rem 0 4.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.resources__hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.8rem;
  padding: 2.8rem;
  border-radius: calc(var(--radius-xl) * 1.1);
  background: radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent),
    var(--gradient-hero);
  color: #fff;
  box-shadow: var(--shadow-xl);
}

.hero__content h2 {
  font-size: clamp(2rem, 4vw, 2.7rem);
  margin-bottom: 0.6rem;
}

.hero__content p {
  color: rgba(255, 255, 255, 0.86);
}

.hero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin: 1rem 0 0.6rem;
}

.hero__badges span {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.35rem 1rem;
  font-size: 0.85rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.2rem;
}

.hero__link {
  border: none;
  background: transparent;
  color: #fff;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.hero__board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.board-card {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.2rem;
  background: rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.board-card strong {
  font-size: 1.9rem;
}

.board-card small {
  color: rgba(255, 255, 255, 0.75);
}

.resources__filters {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--clr-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-lg);
}

.filters__groups {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.filter-chip,
.filter-pill {
  border: 1px solid var(--clr-border);
  border-radius: 999px;
  padding: 0.45rem 1rem;
  background: transparent;
  color: var(--clr-text);
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
}

.filter-chip.is-active,
.filter-pill.is-active {
  background: rgba(37, 99, 235, 0.08);
  color: var(--clr-primary);
  border-color: rgba(37, 99, 235, 0.4);
}

.filters__chips--ghost .filter-pill {
  border-style: dashed;
}

.filters__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: var(--clr-muted);
}

.resources__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 1.5rem;
}

@media (max-width: 960px) {
  .resources__layout {
    grid-template-columns: 1fr;
  }
}

.resource-spotlight {
  border-radius: var(--radius-xl);
  border: 1px solid var(--clr-border);
  padding: 2rem;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.85), rgba(37, 99, 235, 0.25));
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-xl);
}

.resource-spotlight header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.spotlight__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.spotlight__format,
.spotlight__status {
  border-radius: 999px;
  padding: 0.2rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
}

.spotlight__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.spotlight__tags li {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
}

.spotlight__footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  align-items: center;
}

.spotlight__footer small {
  color: rgba(255, 255, 255, 0.7);
}

.resource-grid {
  border-radius: var(--radius-xl);
  border: 1px solid var(--clr-border);
  padding: 1.5rem;
  background: var(--clr-surface);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  min-height: 100%;
}

.resource-grid--empty {
  display: flex;
  align-items: center;
  justify-content: center;
}


.resource-spotlight--skeleton,
.resource-card--skeleton,
.collection-card--skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skeleton-line {
  height: 16px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.2));
  animation: pulse 1.6s ease infinite;
}

.resource-spotlight--skeleton .skeleton-line:nth-child(1) {
  width: 40%;
  height: 20px;
}

.resource-card--skeleton .skeleton-line:nth-child(1) {
  width: 60%;
}

.resource-card--skeleton .skeleton-line:nth-child(2) {
  width: 90%;
}

.resource-card--skeleton .skeleton-line:nth-child(3) {
  width: 50%;
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
.resource-grid__empty {
  margin: 0;
  color: var(--clr-muted);
}

.resource-card {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: var(--clr-bg-muted);
}

.resource-card__labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--clr-muted);
}

.resource-card__format {
  font-weight: 700;
  color: var(--clr-accent);
}

.resource-card__status {
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
  background: rgba(37, 99, 235, 0.08);
  color: var(--clr-primary);
  font-size: 0.75rem;
}

.resource-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.resource-card__tags li {
  background: rgba(15, 23, 42, 0.06);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.resource-card__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.6rem;
  font-size: 0.85rem;
  color: var(--clr-muted);
}

.resource-card__meta p {
  margin: 0;
  color: var(--clr-text);
  font-weight: 600;
}

.resource-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--clr-muted);
}

.resources__collections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.4rem;
}

.collection-card {
  border-radius: var(--radius-xl);
  border: 1px solid var(--clr-border);
  padding: 1.8rem;
  background: var(--clr-surface);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.collection-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.collection-card__grid {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.collection-card__item {
  border-radius: var(--radius-lg);
  border: 1px dashed var(--clr-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.collection-card__item header,
.collection-card__item footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--clr-muted);
}

.collection-card__item footer button {
  border: none;
  background: transparent;
  color: var(--clr-primary);
  font-weight: 600;
  cursor: pointer;
}

.collection-card__empty {
  margin: 0;
  color: var(--clr-muted);
  font-style: italic;
}

@media (max-width: 640px) {
  .resources__hero,
  .resource-spotlight {
    padding: 1.6rem;
  }

  .resources__filters,
  .resource-grid,
  .collection-card {
    padding: 1.3rem;
  }
}

.resource-modal {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 50;
}

.resource-modal__panel {
  width: min(1080px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: var(--clr-surface);
  border-radius: var(--radius-xxl, 32px);
  padding: 2rem;
  box-shadow: var(--shadow-xxl, 0 35px 90px rgba(15, 23, 42, 0.35));
}

.resource-modal__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid var(--clr-border);
  padding-bottom: 1.2rem;
  margin-bottom: 1.5rem;
}

.resource-modal__close {
  border: none;
  background: rgba(15, 23, 42, 0.06);
  border-radius: 999px;
  width: 40px;
  height: 40px;
  font-size: 1.4rem;
  cursor: pointer;
}

.resource-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 1.5rem;
}

.resource-modal__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-modal__types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.resource-type-card {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: 0.8rem 1rem;
  background: var(--clr-bg-muted);
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resource-type-card strong {
  font-size: 0.9rem;
}

.resource-type-card small {
  font-size: 0.8rem;
  color: var(--clr-muted);
}

.resource-type-card.is-active {
  border-color: var(--resource-accent, var(--clr-primary));
  background: rgba(99, 102, 241, 0.08);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

.modal-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.modal-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.modal-field textarea,
.modal-field input {
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border);
  padding: 0.65rem 0.85rem;
  font-family: inherit;
  font-size: 0.95rem;
  background: var(--clr-bg-muted);
}

.modal-hint {
  font-size: 0.85rem;
  color: var(--clr-muted);
  margin: 0;
}

.modal-field__error {
  color: var(--clr-danger, #ef4444);
  font-weight: 600;
}

.modal-field__success {
  color: var(--clr-success, #16a34a);
  font-weight: 600;
}

.resource-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

.resource-modal__preview {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-xl);
  padding: 1.2rem;
  background: var(--clr-bg-muted);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-modal__preview .resource-card__labels {
  margin-bottom: 0.2rem;
}

.resource-card--preview {
  border: none;
  background: #fff;
}

.resource-modal__media {
  font-size: 0.85rem;
  color: var(--clr-muted);
  word-break: break-word;
}

.resource-modal__media a {
  color: var(--clr-primary);
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .resource-modal__body {
    grid-template-columns: 1fr;
  }

  .resource-modal {
    padding: 1rem;
  }
}
</style>
