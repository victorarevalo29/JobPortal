<template>
    <div class="home" id="producto">
      <section class="home-hero" id="hero">
        <div class="home-hero__grid">
          <div class="home-hero__content">
            <p class="eyebrow">Observabilidad · Personas · Cohorts</p>
            <h1>Un frente único para diseñar, activar y escalar talento.</h1>
            <p class="lede">
              JobPortal articula la trazabilidad completa de cada contratación: datos de cohorts, acuerdos con empleadores
              y acompañamiento humano con métricas visibles desde el día uno.
            </p>
            <div class="home-hero__actions">
              <BaseButton size="lg" @click="goToRegister">Crear cuenta</BaseButton>
              <BaseButton size="lg" variant="ghost" @click="openSupport('https://cal.com/jobportal/demo')">
                Solicitar demo
              </BaseButton>
              <button class="link-button" type="button" @click="goToLogin">Ya tengo acceso</button>
            </div>
            <div class="home-hero__highlights">
              <article v-for="item in heroHighlights" :key="item.title">
                <h3>{{ item.title }}</h3>
                <p>{{ item.copy }}</p>
              </article>
            </div>
          </div>
          <BaseCard class="home-hero__panel" variant="glass">
            <div class="home-hero__panel-header">
              <p class="panel-label">Reporte vivo</p>
              <span class="panel-pill">Actualizado hoy</span>
            </div>
            <div class="panel-metrics">
              <article v-for="stat in heroStats" :key="stat.label">
                <p class="value">{{ stat.value }}</p>
                <p class="label">{{ stat.label }}</p>
                <small>{{ stat.subtext }}</small>
              </article>
            </div>
            <ul class="panel-list">
              <li v-for="metric in heroPanel" :key="metric.label">
                <span>{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </li>
            </ul>
            <footer>
              <p>Seguimiento humano y automatizado en un solo relato operativo.</p>
            </footer>
          </BaseCard>
        </div>
      </section>

      <section class="home-overview" id="metodologia">
        <header>
          <p class="eyebrow">Operamos con claridad</p>
          <h2>Metodología profesional para equipos de People, Career Services y Revenue.</h2>
          <p>
            Cada bloque combina activos digitales, soporte experto y reportes listos para ejecutivos. Documentamos acuerdos,
            SLAs y aprendizajes para que tu comunidad siempre tenga contexto.
          </p>
        </header>
        <div class="home-overview__grid">
          <BaseCard v-for="pillar in operatingPillars" :key="pillar.title" class="pillar-card" variant="soft">
            <template #title>{{ pillar.title }}</template>
            <p>{{ pillar.description }}</p>
            <ul>
              <li v-for="item in pillar.items" :key="item">{{ item }}</li>
            </ul>
          </BaseCard>
        </div>
      </section>

      <section class="home-insights" id="soporte">
        <div class="home-insights__copy">
          <p class="eyebrow">Acompañamiento continuo</p>
          <h2>Planeamos, medimos y ajustamos en ciclos cortos.</h2>
          <p>
            Integramos datos de cohorts, HRIS y CRM para que cada stakeholder reciba la misma fotografía del avance. Nuestro
            equipo interviene cuando detectamos riesgo de rotación o falta de talento disponible.
          </p>
          <ul class="insights-list">
            <li v-for="point in insightPoints" :key="point">{{ point }}</li>
          </ul>
        </div>
        <BaseCard class="home-insights__timeline" variant="soft">
          <template #title>Ruta de despliegue</template>
          <article v-for="milestone in milestones" :key="milestone.title">
            <span>{{ milestone.timeframe }}</span>
            <div>
              <h3>{{ milestone.title }}</h3>
              <p>{{ milestone.copy }}</p>
            </div>
          </article>
        </BaseCard>
      </section>

      <section class="home-metrics" id="metricas">
        <header>
          <p class="eyebrow">Métricas accionables</p>
          <h2>Visibilidad diaria para talento, empleadores y aliados académicos.</h2>
          <p>Seguimos el pulso de la comunidad con datos comparables y alertas proactivas.</p>
        </header>
        <div class="metrics__grid">
          <BaseCard
            v-for="metric in signatureMetrics"
            :key="metric.label"
            class="metric-card"
            :variant="metric.variant"
          >
            <template #title>{{ metric.label }}</template>
            <p class="metric-card__value">{{ metric.value }}</p>
            <p class="metric-card__delta" :class="`metric-card__delta--${metric.trend}`">
              {{ metric.delta }}
            </p>
            <p class="metric-card__copy">{{ metric.description }}</p>
          </BaseCard>
        </div>
        <div class="metrics__partners">
          <article v-for="signal in partnerSignals" :key="signal.label">
            <p class="value">{{ signal.value }}</p>
            <p class="label">{{ signal.label }}</p>
          </article>
        </div>
      </section>

      <section class="home-search" id="busqueda">
        <div class="home-search__intro">
          <p class="eyebrow">Búsqueda avanzada</p>
          <h2>Filtra vacantes y cohorts según contexto real.</h2>
          <p>Conecta skills, disponibilidad y expectativas salariales sin navegar hojas de cálculo.</p>
        </div>
        <BaseCard class="search-card">
          <form class="search-form" @submit.prevent="goToJobs">
            <label>
              <span>Rol objetivo</span>
              <input v-model="searchModel.role" type="text" placeholder="Ej. Product Manager" />
            </label>
            <label>
              <span>Ubicación / huso horario</span>
              <input v-model="searchModel.location" type="text" placeholder="CDMX · Bogotá · Remote" />
            </label>
            <div class="search-form__row">
              <label>
                <span>Modalidad</span>
                <select v-model="searchModel.modality">
                  <option v-for="option in modalityOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
              <label>
                <span>Seniority</span>
                <select v-model="searchModel.seniority">
                  <option v-for="option in seniorityOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </label>
              <label>
                <span>Rango salarial (USD)</span>
                <select v-model="searchModel.salary">
                  <option v-for="range in salaryRanges" :key="range" :value="range">
                    {{ range }}
                  </option>
                </select>
              </label>
            </div>
            <div class="search-form__chips">
              <button
                v-for="tag in jobTags"
                :key="tag"
                type="button"
                :class="['chip', { 'chip--active': searchModel.tags.includes(tag) }]"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
            <div class="search-form__footer">
              <small>Actualizamos coincidencias cada 6 horas con señales del mercado.</small>
              <BaseButton type="submit" size="lg">Buscar posiciones</BaseButton>
            </div>
          </form>
        </BaseCard>
      </section>

      <section class="home-jobs" id="vacantes">
        <header>
          <p class="eyebrow">Vacantes seleccionadas</p>
          <h2>Tarjetas modernas listas para compartir con tu comunidad.</h2>
          <p>Curamos equipos con foco en cultura, aprendizaje y resultados.</p>
        </header>
        <div v-if="featuredJobs.length" class="jobs__grid">
          <BaseCard v-for="job in featuredJobs" :key="job.id" class="job-card" variant="soft">
            <template #title>
              <div class="job-card__header">
                <div>
                  <p class="job-card__company">{{ job.company }}</p>
                  <h3>{{ job.title }}</h3>
                </div>
                <span class="job-card__badge">{{ job.modality }}</span>
              </div>
            </template>
            <p class="job-card__location">{{ job.location }}</p>
            <p class="job-card__description">{{ jobSnippet(job.description) }}</p>
            <p class="job-card__salary">{{ job.salaryRange }}</p>
            <div class="job-card__tags">
              <span v-for="tag in (job.skills.length ? job.skills.slice(0, 3) : fallbackJobTags)" :key="tag">
                {{ tag }}
              </span>
            </div>
            <template #footer>
              <div class="job-card__footer">
                <p>{{ job.postedAgo }}</p>
                <BaseButton size="sm" @click="goToJob(job.id)">Ver detalles</BaseButton>
              </div>
            </template>
          </BaseCard>
        </div>
        <BaseCard v-else class="jobs__empty">
          <template #title>{{ jobsStore.loading ? 'Cargando vacantes…' : 'Sin vacantes disponibles' }}</template>
          <p>
            {{ jobsStore.error || 'Publica tu primera vacante o vuelve más tarde para ver nuevas oportunidades.' }}
          </p>
        </BaseCard>
      </section>

      <section class="home-proof" id="confianza">
        <BaseCard variant="dark" class="proof-card">
          <template #title>
            +120 organizaciones confían en JobPortal
          </template>
          <p>
            Operamos con acuerdos de datos claros, reporting exportable y acompañamiento humano en cada hito.
          </p>
          <div class="proof-card__logos">
            <span v-for="logo in partnerBadges" :key="logo">{{ logo }}</span>
          </div>
          <footer>
            <button class="link-button" type="button" @click="openSupport('mailto:hola@jobportal.dev')">
              Conversemos para personalizar tu lanzamiento →
            </button>
          </footer>
        </BaseCard>
      </section>
    </div>
  </template>

  <script setup>
  import { reactive, computed, onMounted } from 'vue'
  import BaseButton from '@/components/BaseButton.vue'
  import BaseCard from '@/components/BaseCard.vue'
  import { useRouter } from 'vue-router'
  import { useJobsStore } from '@/stores/jobsStore'

  const router = useRouter()
  const jobsStore = useJobsStore()

  const heroHighlights = [
    { title: 'Contexto único', copy: 'Playbooks, agreements y assets listos para cada cohort activo.' },
    { title: 'Mentoría curada', copy: 'Agenda, SLAs y NPS con trazabilidad por rol y seniority.' },
    { title: 'Segmentación global', copy: 'Talento bilingüe y disponibilidad validada por huso horario.' }
  ]

  const heroStats = [
    { label: 'Contrataciones aceleradas', value: '320', subtext: 'Últimos 12 meses' },
    { label: 'Cohorts simultáneos', value: '34', subtext: 'Producto · Data · Ingeniería' },
    { label: 'SLA de soporte', value: '94%', subtext: 'Resuelto < 48h' }
  ]

  const heroPanel = [
    { label: 'Matching activo', value: '87% fit' },
    { label: 'Mentorías / semana', value: '142 sesiones' },
    { label: 'Health score', value: '9.2 / 10' }
  ]

  const signatureMetrics = [
    {
      label: 'Tiempo a contratación',
      value: '23 días',
      delta: '-18% vs región',
      description: 'Automatizamos el seguimiento de cohort y entrevistas.',
      variant: 'glass',
      trend: 'down'
    },
    {
      label: 'Retención a 6 meses',
      value: '92%',
      delta: '+9 pts YoY',
      description: 'Monitoreamos bienestar, mentorías y feedback continuo.',
      variant: 'soft',
      trend: 'up'
    },
    {
      label: 'Ahorro en sourcing',
      value: '146 hrs',
      delta: '-32% esfuerzo',
      description: 'Plantillas artesanales eliminan tareas repetitivas.',
      variant: 'soft',
      trend: 'down'
    }
  ]

  const operatingPillars = [
    {
      title: 'Diagnóstico + blueprint',
      description: 'Mapeamos objetivos, riesgos y acuerdos entre talento y empleadores.',
      items: ['Workshops kickoff', 'Scorecards compartidos', 'Gobernanza de datos']
    },
    {
      title: 'Activación multirole',
      description: 'Playbooks para cohorts, mentoring pods y squads de reclutamiento.',
      items: ['Recursos a demanda', 'Alertas en vivo', 'Integraciones HRIS / ATS']
    },
    {
      title: 'Evolución continua',
      description: 'Narrativas ejecutivas y reportes listos para decision makers.',
      items: ['Insights descargables', 'Benchmarks regionales', 'Capacitación de equipos']
    }
  ]

  const insightPoints = [
    'Alertas de rotación en tiempo real',
    'Reportes descargables con branding',
    'Mentores certificados por vertical'
  ]

  const milestones = [
    { timeframe: 'Semana 1', title: 'Kick-off y setup', copy: 'Sincronizamos objetivos, roles y assets de marca.' },
    { timeframe: 'Semana 3', title: 'Cohorts en marcha', copy: 'Seguimiento de retos, feedback y mentorías activas.' },
    { timeframe: 'Semana 6', title: 'Contrataciones', copy: 'Reportes de match, métricas de retención y storytelling.' }
  ]

  const partnerSignals = [
    { label: 'Scaleups Serie B', value: '17' },
    { label: 'Universidades asociadas', value: '24' },
    { label: 'Mentores certificados', value: '58' }
  ]

  const modalityOptions = ['Remote-first', 'Hybrid', 'On-site']
  const seniorityOptions = ['Junior', 'Mid', 'Senior', 'Leadership']
  const salaryRanges = ['< 30k', '30k - 40k', '40k - 60k', '60k+']
  const jobTags = ['Producto', 'UX', 'Data', 'Backend', 'Ventas', 'Operaciones']
  const fallbackJobTags = ['Producto', 'UX', 'Data']

  const partnerBadges = ['Aptiva', 'Northwind Tech', 'BetaCampus', 'Covalent', 'Skyforge']

  const featuredJobs = computed(() => jobsStore.jobs.slice(0, 3))

  const searchModel = reactive({
    role: '',
    location: '',
    modality: modalityOptions[0],
    seniority: seniorityOptions[1],
    salary: salaryRanges[2],
    tags: ['Producto', 'Data']
  })

  const goToLogin = () => router.push('/login')
  const goToRegister = () => router.push('/register')
  const openSupport = (url) => window.open(url, '_blank')
  const goToJob = (id) => router.push(`/jobs/${id}`)

  const jobSnippet = (text = '') => {
    if (!text) return 'Revisa la vacante para conocer la descripción completa.'
    return text.length > 140 ? `${text.slice(0, 140)}…` : text
  }

  const goToJobs = () => {
    router.push({
      path: '/jobs',
      query: {
        role: searchModel.role || undefined,
        location: searchModel.location || undefined,
        modality: searchModel.modality,
        seniority: searchModel.seniority,
        salary: searchModel.salary,
        tags: searchModel.tags.join(',')
      }
    })
  }

  const toggleTag = (tag) => {
    const exists = searchModel.tags.includes(tag)
    searchModel.tags = exists ? searchModel.tags.filter((item) => item !== tag) : [...searchModel.tags, tag]
  }

  onMounted(() => {
    if (!jobsStore.jobs.length) {
      jobsStore.fetchJobs({ status: 'active' })
    }
  })
  </script>

  <style scoped>
  .home {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-section);
    padding: clamp(3rem, 5vw, 5rem) 0 6rem;
    line-height: 1.6;
  }

  .home-hero {
    border-radius: var(--radius-xl);
    padding: clamp(2.8rem, 6vw, 4.5rem);
    background: var(--gradient-hero);
    color: #f8fbff;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-card);
  }

  .home-hero::after,
  .home-hero::before {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.45;
  }

  .home-hero::after {
    width: 420px;
    height: 420px;
    background: rgba(56, 189, 248, 0.3);
    top: -120px;
    right: -80px;
  }

  .home-hero::before {
    width: 320px;
    height: 320px;
    background: rgba(124, 58, 237, 0.25);
    bottom: -150px;
    left: -60px;
  }

  .home-hero__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(1.5rem, 3vw, 3.5rem);
    z-index: 1;
  }

  .home-hero__content h1 {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 5vw, 4.2rem);
    line-height: 1.05;
    margin: 1rem 0;
  }

  .lede {
    max-width: 62ch;
    color: rgba(248, 251, 255, 0.92);
    font-size: 1.05rem;
  }

  .home-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin: 2rem 0 1.5rem;
  }

  .home-hero__highlights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.2rem;
  }

  .home-hero__highlights article {
    background: rgba(15, 23, 42, 0.45);
    border-radius: var(--radius-md);
    padding: 1rem 1.2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .home-hero__highlights h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
  }

  .home-hero__panel {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .home-hero__panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .panel-label {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.78rem;
    color: var(--clr-muted);
  }

  .panel-pill {
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    background: rgba(37, 99, 235, 0.12);
    color: var(--clr-primary);
    font-weight: 600;
  }

  .panel-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.9rem;
  }

  .panel-metrics article {
    border-radius: var(--radius-md);
    padding: 1rem;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(37, 99, 235, 0.1);
  }

  .value {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .label {
    margin: 0.2rem 0;
    font-weight: 600;
    color: var(--clr-text);
  }

  .panel-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .panel-list li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed rgba(15, 23, 42, 0.12);
    padding-bottom: 0.4rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.35em;
    font-size: 0.78rem;
    color: var(--clr-accent);
    font-weight: 600;
  }

  .link-button {
    border: none;
    background: none;
    color: var(--clr-accent);
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0;
  }

  .home-overview header,
  .home-jobs header,
  .home-metrics header {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    max-width: 720px;
  }

  .home-overview__grid {
    margin-top: 2.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .pillar-card ul {
    margin: 1rem 0 0;
    padding-left: 1.25rem;
    color: var(--clr-muted);
  }

  .home-insights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    align-items: start;
  }

  .home-insights__copy {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .insights-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .insights-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .insights-list li::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--clr-primary);
  }

  .home-insights__timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .home-insights__timeline article {
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }

  .home-insights__timeline span {
    min-width: 90px;
    font-weight: 700;
    color: var(--clr-primary);
  }

  .metrics__grid {
    margin-top: 2.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .metric-card__value {
    font-family: var(--font-heading);
    font-size: 2.3rem;
    margin: 0.5rem 0;
  }

  .metric-card__delta {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .metric-card__delta--up {
    color: #22c55e;
  }

  .metric-card__delta--down {
    color: #f97316;
  }

  .metrics__partners {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .metrics__partners article {
    padding: 1.25rem;
    border-radius: var(--radius-md);
    border: 1px dashed rgba(37, 99, 235, 0.2);
    background: rgba(255, 255, 255, 0.85);
    text-align: center;
  }

  .home-search {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    align-items: center;
  }

  .home-search__intro {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .search-card {
    background: var(--gradient-card);
    border: 1px solid rgba(37, 99, 235, 0.12);
  }

  .search-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .search-form label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    color: var(--clr-text);
  }

  .search-form input,
  .search-form select {
    border-radius: var(--radius-sm);
    border: 1px solid rgba(15, 23, 42, 0.16);
    padding: 0.9rem 1rem;
    background: #fff;
    font-size: 1rem;
  }

  .search-form__row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .search-form__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .chip {
    border-radius: 999px;
    border: 1px solid rgba(59, 130, 246, 0.4);
    background: transparent;
    padding: 0.45rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--clr-primary);
    cursor: pointer;
    transition: background var(--transition-base), color var(--transition-base);
  }

  .chip--active {
    background: var(--clr-primary);
    color: #fff;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  }

  .search-form__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .home-jobs {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .jobs__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .job-card {
    background: linear-gradient(165deg, rgba(255, 255, 255, 0.96), rgba(226, 232, 255, 0.9));
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .job-card__header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }

  .job-card__company {
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.75rem;
    color: var(--clr-muted);
    margin: 0 0 0.3rem;
  }

  .job-card__badge {
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    background: rgba(37, 99, 235, 0.12);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--clr-primary);
  }

  .job-card__location,
  .job-card__description,
  .job-card__salary {
    margin: 0.2rem 0;
  }

  .job-card__salary {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .job-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .job-card__tags span {
    border-radius: var(--radius-sm);
    background: rgba(15, 23, 42, 0.06);
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--clr-text);
  }

  .job-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .home-proof {
    display: flex;
    justify-content: center;
  }

  .proof-card {
    width: 100%;
    text-align: center;
  }

  .proof-card__logos {
    margin: 1.5rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .proof-card__logos span {
    border-radius: var(--radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 992px) {
    .home-hero__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .panel-metrics {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }

    .search-form__footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 640px) {
    .home {
      padding-bottom: 4rem;
    }

    .home-search {
      grid-template-columns: 1fr;
    }

    .search-form__row {
      grid-template-columns: 1fr;
    }
  }
  </style>
