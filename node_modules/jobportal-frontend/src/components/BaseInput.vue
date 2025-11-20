<template>
  <label class="base-input">
    <span v-if="label" class="base-input__label">{{ label }}</span>
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
    />
    <small v-if="helper" class="base-input__helper">{{ helper }}</small>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: String,
  helper: String,
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
  color: var(--clr-text);
}

input {
  border: 1px solid var(--clr-border);
  border-radius: 1rem;
  padding: 0.95rem 1.1rem;
  font-size: 1rem;
  font-family: var(--font-heading);
  background: var(--clr-bg-muted);
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 120ms ease;
}

input:focus {
  border-color: var(--clr-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  background: #fff;
}

input:hover {
  transform: translateY(-1px);
}

.base-input__helper {
  font-size: 0.8rem;
  color: var(--clr-muted);
}
</style>
