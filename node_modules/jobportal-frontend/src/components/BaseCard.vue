<template>
  <article :class="['card', `card--${variant}`]">
    <header v-if="$slots.title">
      <slot name="title" />
    </header>
    <section>
      <slot />
    </section>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'soft'
  }
})
</script>

<style scoped>
.card {
  border-radius: var(--radius-lg);
  padding: 1.8rem;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(37, 99, 235, 0.12);
  background: var(--clr-surface);
  position: relative;
  overflow: hidden;
}

.card::after {
  content: '';
  position: absolute;
  inset: auto auto -45% 50%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12), transparent 70%);
  transform: translateX(-50%);
}

.card > * {
  position: relative;
  z-index: 1;
}

.card--soft {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 244, 255, 0.9));
}

.card--dark {
  background: #0f172a;
  color: #f8fafc;
  border-color: rgba(148, 163, 184, 0.2);
}

.card--glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

header {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
  font-family: var(--font-heading);
}

footer {
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
