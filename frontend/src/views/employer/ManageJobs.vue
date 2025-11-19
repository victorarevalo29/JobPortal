<template>
  <section class="manage-jobs">
    <header class="manage-jobs__header">
      <div>
        <p class="section-kicker">Vacantes</p>
        <h1>Publica o edita tus posiciones abiertas.</h1>
        <p>Cuenta historias atractivas sobre tu equipo, define expectativas y sincroniza estatus en segundos.</p>
      </div>
      <BaseButton variant="ghost" size="sm" @click="resetForm">Reiniciar formulario</BaseButton>
    </header>

    <div class="manage-jobs__layout">
      <section class="manage-jobs__table">
        <BaseCard>
          <template #title>Vacantes activas</template>
          <table class="panel-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Contrato</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in jobsStore.jobs" :key="job.id">
                <td>
                  <strong>{{ job.title }}</strong>
                  <p>{{ job.company }}</p>
                </td>
                <td>{{ job.modality }}</td>
                <td>{{ job.location }}</td>
                <td><span class="status-pill">{{ job.status }}</span></td>
                <td class="actions">
                  <button class="table-link" @click="selectJob(job)">Editar</button>
                  <button class="table-link danger" @click="deleteJob(job.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </BaseCard>
      </section>

      <section class="manage-jobs__form">
        <BaseCard>
          <template #title>{{ isEditing ? 'Actualizar vacante' : 'Nueva vacante' }}</template>
          <form class="job-form" @submit.prevent="handleSubmit">
            <div class="field">
              <span>Puesto</span>
              <BaseInput v-model="form.title" placeholder="Ej. Product Designer" required />
            </div>
            <div class="field">
              <span>Compañía</span>
              <div v-if="hasLinkedCompany" class="company-locked">
                <p class="company-locked__name">{{ employerCompanyName || 'Empresa vinculada' }}</p>
                <p class="company-locked__hint">Se usa la empresa registrada en tu perfil.</p>
              </div>
              <select v-else v-model="form.companyId" required>
                <option value="" disabled>Selecciona una empresa</option>
                <option v-for="company in companiesStore.companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
            <div class="field">
              <span>Ubicación</span>
              <BaseInput v-model="form.location" placeholder="Remoto / Ciudad" required />
            </div>
            <div class="field">
              <span>Contrato</span>
              <select v-model="form.contractType" required>
                <option v-for="option in contractTypes" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="field">
              <span>Rango salarial</span>
              <div class="salary-grid">
                <BaseInput v-model.number="form.salaryMin" type="number" min="0" placeholder="Mínimo" />
                <BaseInput v-model.number="form.salaryMax" type="number" min="0" placeholder="Máximo" />
                <select v-model="form.salaryCurrency">
                  <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <span>Descripción corta</span>
              <textarea v-model="form.description" rows="4" placeholder="Comparte contexto sobre el reto"></textarea>
            </div>
            <div class="field">
              <span>Experiencia requerida</span>
              <BaseInput v-model="form.requiredExperience" placeholder="3+ años liderando squads" />
            </div>
            <div class="field">
              <span>Estado</span>
              <select v-model="form.status">
                <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>

            <div class="job-form__actions">
              <BaseButton type="submit" :is-loading="jobsStore.saving">
                {{ isEditing ? 'Guardar cambios' : 'Publicar vacante' }}
              </BaseButton>
              <BaseButton v-if="isEditing" variant="ghost" type="button" @click="resetForm">Cancelar</BaseButton>
            </div>
          </form>
        </BaseCard>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useJobsStore } from '@/stores/jobsStore'
import { useCompaniesStore } from '@/stores/companiesStore'
import { useAuthStore } from '@/stores/authStore'

const jobsStore = useJobsStore()
const companiesStore = useCompaniesStore()
const authStore = useAuthStore()

const contractTypes = [
  { value: 'full-time', label: 'Tiempo completo' },
  { value: 'part-time', label: 'Medio tiempo' },
  { value: 'contract', label: 'Contrato' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporal' }
]

const currencies = ['USD', 'MXN', 'COP', 'CLP']
const statusOptions = ['draft', 'active', 'paused', 'closed']

const blankForm = () => ({
  id: null,
  title: '',
  companyId: '',
  location: '',
  contractType: 'full-time',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  description: '',
  requiredExperience: '',
  status: 'active'
})

const form = reactive(blankForm())
const isEditing = computed(() => Boolean(form.id))
const employerCompanyId = computed(() => {
  const company = authStore.user?.company
  if (!company) return ''
  if (typeof company === 'string') return company
  return company.id || company._id || ''
})
const employerCompanyName = computed(() => {
  const company = authStore.user?.company
  if (!company) return ''
  if (typeof company === 'string') {
    const match = companiesStore.companies.find((item) => item.id === company)
    return match?.name || ''
  }
  return company.name || ''
})
const hasLinkedCompany = computed(() => Boolean(employerCompanyId.value))

const setDefaultCompany = () => {
  if (hasLinkedCompany.value) {
    form.companyId = employerCompanyId.value
  } else if (!form.companyId && companiesStore.companies.length) {
    form.companyId = companiesStore.companies[0].id
  }
}

const selectJob = (job) => {
  Object.assign(form, blankForm(), {
    id: job.id,
    title: job.title,
    companyId: job.companyId,
    location: job.location,
    contractType: job.contractType,
    salaryMin: job.raw?.salaryRange?.min || '',
    salaryMax: job.raw?.salaryRange?.max || '',
    salaryCurrency: job.raw?.salaryRange?.currency || 'USD',
    description: job.description,
    requiredExperience: job.raw?.requiredExperience || '',
    status: job.status
  })
}

const resetForm = () => {
  Object.assign(form, blankForm())
  setDefaultCompany()
}

const handleSubmit = async () => {
  if (!form.title.trim()) {
    return
  }

  if (!form.companyId) {
    return
  }

  const payload = {
    title: form.title.trim(),
    company: form.companyId,
    location: form.location.trim(),
    contractType: form.contractType,
    description: form.description.trim(),
    requiredExperience: form.requiredExperience.trim() || undefined,
    status: form.status,
    salaryRange: {
      min: form.salaryMin || undefined,
      max: form.salaryMax || undefined,
      currency: form.salaryCurrency
    }
  }

  if (!payload.salaryRange.min && !payload.salaryRange.max) {
    payload.salaryRange = undefined
  }

  if (isEditing.value) {
    await jobsStore.updateJob(form.id, payload)
  } else {
    await jobsStore.createJob(payload)
  }
  resetForm()
}

const deleteJob = async (jobId) => {
  await jobsStore.deleteJob(jobId)
  if (form.id === jobId) {
    resetForm()
  }
}

onMounted(async () => {
  if (!authStore.user?.company && authStore.token) {
    await authStore.fetchCurrentUser()
  }
  if (!jobsStore.jobs.length) {
    await jobsStore.fetchJobs({ status: undefined })
  }
  if (!hasLinkedCompany.value && !companiesStore.companies.length) {
    await companiesStore.fetchCompanies()
  }
})

watch(
  () => companiesStore.companies.length,
  (count) => {
    if (count && !form.companyId && !hasLinkedCompany.value) {
      form.companyId = companiesStore.companies[0].id
    }
  },
  { immediate: true }
)

watch(
  employerCompanyId,
  (id) => {
    if (id) {
      form.companyId = id
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.manage-jobs {
  padding: 3rem 0 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.manage-jobs__header {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-card);
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.manage-jobs__layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--clr-muted);
  font-size: 0.75rem;
}

.panel-table {
  width: 100%;
  border-collapse: collapse;
}

.panel-table th,
.panel-table td {
  text-align: left;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.panel-table strong {
  display: block;
}

.panel-table p {
  margin: 0;
  color: var(--clr-muted);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.table-link {
  border: none;
  background: none;
  color: var(--clr-primary);
  font-weight: 600;
  cursor: pointer;
}

.table-link.danger {
  color: var(--clr-danger);
}

.status-pill {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  font-size: 0.85rem;
  text-transform: capitalize;
}

.job-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.job-form .field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
}

.job-form textarea {
  border-radius: var(--radius-md);
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 0.75rem 1rem;
  background: var(--clr-surface);
}

.job-form select {
  border-radius: var(--radius-md);
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 0.75rem 1rem;
  background: var(--clr-surface);
  font-weight: 600;
}

.company-locked {
  border-radius: var(--radius-md);
  border: 1px dashed rgba(15, 23, 42, 0.3);
  padding: 0.85rem 1rem;
  background: rgba(148, 163, 184, 0.08);
}

.company-locked__name {
  margin: 0;
  font-weight: 700;
}

.company-locked__hint {
  margin: 0.25rem 0 0;
  color: var(--clr-muted);
  font-size: 0.85rem;
}

.salary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.job-form__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .manage-jobs__layout {
    grid-template-columns: 1fr;
  }
}
</style>
