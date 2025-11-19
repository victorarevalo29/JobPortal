<template>
  <section class="resources">
    <header class="resources__hero">
      <div class="hero__content">
        <p class="section-kicker">Librería viva</p>
        <h2>Recursos curados para diseñar tu roadmap profesional con intención.</h2>
        <p>
          Playbooks, talleres y plantillas auditadas cada semana por mentores operando en squads reales.
          Todo listo para compartir con tu cohorte en cuestión de minutos.
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
      <article v-if="resourcesStore.loading" v-for="skeleton in 2" :key="`collection-${skeleton}`" class="collection-card collection-card--skeleton">
        <div class="skeleton-line" />
        <div class="skeleton-line" />
        <div class="skeleton-line" />
      </article>
      <article v-else-if="!groupedResources.length && !resourcesStore.error" class="collection-card">
        <template #title>Colecciones en camino</template>
        <p>Añade nuevos recursos para desbloquear colecciones curadas.</p>
      </article>
      <article v-else v-for="group in groupedResources" :key="group.format" class="collection-card">
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
      <BaseCard v-if="resourcesStore.error" class="collection-card__error">
        <template #title>Error al cargar colecciones</template>
        <p>{{ resourcesStore.error }}</p>
        <BaseButton size="sm" variant="ghost" @click="resourcesStore.fetchResources()">Reintentar</BaseButton>
      </BaseCard>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useResourcesStore } from '@/stores/resourcesStore'

const resourcesStore = useResourcesStore()

const statusFilters = ['Todos', 'Nuevo']
const heroBadges = ['Playbooks accionables', 'Feedback curado', 'Ready to ship']

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

const categoryFilters = computed(() => {
  const categories = Array.from(new Set(resourcesStore.resources.map((resource) => resource.category)))
  return ['Todos', ...categories]
})

watch(categoryFilters, (filters) => {
  if (!filters.includes(selectedFilter.value)) {
    selectedFilter.value = 'Todos'
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
</style>
