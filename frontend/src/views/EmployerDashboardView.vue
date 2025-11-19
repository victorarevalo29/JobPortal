<template>
  <section class="dashboard">
    <header>
      <p class="section-kicker">Panel employer</p>
      <h2>Monitorea cohorts, mensajes y vacantes desde un solo lugar.</h2>
      <p>Métricas vivas para decidir dónde enfocar tus siguientes sprints de contratación.</p>
    </header>

    <div class="dashboard__grid">
      <article v-for="card in cards" :key="card.label" class="dashboard-card" :class="card.variant">
        <p class="dashboard-card__label">{{ card.label }}</p>
        <h3>{{ card.value }}</h3>
        <small>{{ card.subtext }}</small>
      </article>
    </div>
  </section>
</template>

<script setup>
const cards = [
  { label: 'Vacantes activas', value: '04', subtext: 'Integradas con job store', variant: 'dashboard-card--primary' },
  { label: 'Postulaciones filtradas', value: '28', subtext: 'Últimos 14 días', variant: 'dashboard-card--neutral' },
  { label: 'Mensajes pendientes', value: '05', subtext: 'Con recordatorio automático', variant: 'dashboard-card--neutral' }
]
</script>

<style scoped>
.dashboard {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  border-radius: var(--radius-lg);
  padding: 1.8rem;
  border: 1px solid rgba(37, 99, 235, 0.12);
  background: var(--clr-surface);
  box-shadow: var(--shadow-soft);
}

.dashboard-card__label {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  color: var(--clr-muted);
}

.dashboard-card h3 {
  font-size: 2.5rem;
  margin: 0.6rem 0;
}

.dashboard-card--primary {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
  color: #fff;
  border: none;
}

.dashboard-card--neutral {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.95), rgba(236, 244, 255, 0.9));
}
</style>
